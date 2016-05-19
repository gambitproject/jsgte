/*
Author: Surya Nyayapati
http://www.nyayapati.com/surya

The MIT License (MIT)
Copyright (c) <2012> <Surya Nyayapati>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function (window, undefined) {
    var X2J = {
        VERSION: '1.1',
        //convert xml to x2j object
        //Rule: Get ordered list of javascript object for xml
        parseXml: function (xml, xpathExpression) {
            var isObjectEmpty = function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            };
            //TODO:if there is name conflict, change name and during output change it back

            //jNode = [{jName, jValue}] || [{jIndex, jNode,jName}]
            //jIndex = [{jName, counter}]    
            //jName = "node_name"    
            //jValue = "node_value"
            //counter = 0..n (i.e. index for jNode)
            var GetChildNode = function (domElement) {
                var obj = {};  
                obj['jName'] = domElement.nodeName;
                obj['jAttr'] = GetAttributes(domElement.attributes);
                
                for (var i = 0; i < domElement.childNodes.length; i++) {
                    var node1 = domElement.childNodes[i];
                    if (node1.nodeType === TEXT_NODE) {                        
                        if (node1.textContent.trim() !== "") {
                            obj['jValue'] = node1.textContent;                            
                        }                        
                    }
                    else 
                    {
                        var tmp = {};
                        var childNode = GetChildNode(node1);
                        for (var key in childNode) {                            
                            if (key !== 'jIndex' && key !== 'jValue') {
                                tmp[key] = childNode[key];
                            }
                        }
                        
                        if(!childNode['jIndex'])
                        {
                            tmp = childNode;
                            if (!tmp.hasOwnProperty('jValue')) {
                                tmp['jValue'] = '';
                            }
                        }    
                        
                        if (obj['jIndex'] === undefined) {
                            obj['jIndex'] = [];
                        }

                        if (obj.hasOwnProperty(node1.nodeName)) {
                            obj['jIndex'].push([node1.nodeName, obj[node1.nodeName].length]);
                            if (childNode['jIndex'] !== undefined) {
                                tmp['jIndex'] = childNode['jIndex'];
                            }
                            obj[node1.nodeName].push(tmp);
                        }
                        else {
                            obj[node1.nodeName] = [];
                            obj['jIndex'].push([node1.nodeName, obj[node1.nodeName].length]);
                            if (childNode['jIndex'] !== undefined) {
                                tmp['jIndex'] = childNode['jIndex'];
                            }
                            obj[node1.nodeName].push(tmp);
                        }
                    }
                }
                
                return obj;
            };

            //Rule: attributes are unique list of name value pair inside a node.
            //Summary: This will return an object with jIndex property as an array and all the attributes as name value properties.
            //The number of attributes in a node will be equal to jIndex length. each element inside jIndex will be same as attribute name.
            var GetAttributes = function (attrs) {            
                var obj = {};                
                obj['jIndex'] = [];
                if(!attrs) return obj;
                
                for (var i = 0; i < attrs.length; i++) { 
                    obj[attrs[i].name] = attrs[i].value;
                    obj['jIndex'].push(attrs[i].name);
                }
                return obj;
            };
            
            if (!xml) {
                return;
            }
            if (!xpathExpression) {
                xpathExpression = '/';
            }
            //var xmlStr = (new XMLSerializer()).serializeToString(xml);
            var xmlDocument = null;
            if(typeof(xml) ==='string')
            {
                var parser = new DOMParser();
                xmlDocument = parser.parseFromString(xml, "text/xml");
            }
            else
            {
                xmlDocument = xml;
            }
            
            //var xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            //var nodes = xmlDoc.evaluate("/", xmlDoc, null, XPathResult.ANY_TYPE, null);
            var xPathResult1 = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.ANY_TYPE, null);
            if (xPathResult1.resultType === UNORDERED_NODE_ITERATOR_TYPE
            || xPathResult1.resultType === ORDERED_NODE_ITERATOR_TYPE) {//if result is a node-set then UNORDERED_NODE_ITERATOR_TYPE is always the resulting type

                var dom_node1 = xPathResult1.iterateNext(); //returns node https://developer.mozilla.org/en/DOM/Node
                var domArr = [];
                while (dom_node1) {                                           
                    domArr.push(GetChildNode(dom_node1));
                    dom_node1 = xPathResult1.iterateNext();
                }
                //if (domArr.length == 1) {
                //    return domArr[0];
                //}
                return domArr;

            } else {
                console.log(xPathResult1);
            }
        },
        printJNode: function (jNode, callback) {
            if (jNode === undefined) {
                return;
            }
            var _printNode = function (jNode, level) {
                if (jNode.jIndex !== undefined) {
                    for (var j = 0; j < jNode.jIndex.length; j++) {
                        var node = jNode[jNode.jIndex[j][0]][jNode.jIndex[j][1]];
                        if (node.jIndex !== undefined) {
                            callback(jNode.jIndex[j][0], node.jIndex, node.jAttr, level);
                            _printNode(node, level + 1); //go deeper
                        } else {
                            callback(node.jName, node.jValue, node.jAttr, level);
                        }
                    }
                } else {
                    callback(jNode.jName, jNode.jValue, jNode.jAttr, level);
                }
            };
            _printNode(jNode, 0);
        },
        printJAttribute: function (jAttr) {
            var strArr = [];
            if (jAttr.jIndex) {
                for (var i = 0; i < jAttr.jIndex.length; i++) {
                    strArr.push(jAttr.jIndex[i] + "=" + jAttr[jAttr.jIndex[i]]);
                }
            }
            return strArr.join(', ');
        },
        ///Safe way to get value, Use when not sure if a name is present. if not present return default_value.
        getValue: function (jNode, name, index, default_value) {//if index undefined then 0
            //console.log(jNode, name, index,default_value);
            if (jNode === undefined || jNode === null) {
                return default_value;
            }
            if (index === undefined || typeof(index) != 'number') {
                index = 0;
            }

            if (index >= 0) {//if index is present
                if (jNode.length !== undefined && jNode.length == index + 1) {//if array
                    if (jNode[index].jName !== undefined && jNode[index].jName == name) {
                        //console.log('getValue 0');
                        return jNode[index].jValue; //tested
                    }
                }
                else if (jNode[name] !== undefined) {//if not array but name obj is array then return indexOf
                    var node = jNode[name][index];
                    if (node !== undefined) {
                        if (node.jValue !== undefined) {
                            //console.log('getValue 1');
                            return node.jValue;
                        } else {
                            //console.log('getValue 2');
                            return node;
                        }
                    }
                }
                else if (jNode.jName !== undefined && jNode.jName == name) {
                    //console.log('getValue 3');
                    return jNode.jValue;
                }
                else if (jNode.length === undefined && jNode[name]) { //if not array and name exists
                    //console.log('getValue 4');
                    return jNode[name]; //tested
                }

                return default_value;
            }

            throw new RangeError("index must be positive!");

        },
        search: function (jNode, name, options) {
            //options is object with keys like 'max_deep', ...
            //same as getValue, but returns array of obj(jName,jValue/jIndex,jAttr,[jNode]??)
        },
        getAttr: function (jNode, name) {
            var isObjectEmpty = function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            };

            if (!jNode || !jNode.jAttr || isObjectEmpty(jNode.jAttr)) {
                return;
            }
            return jNode.jAttr[name];
        },
        getJson: function (jNode) {
            return JSON.stringify(jNode);
        },
        getXml: function (jNode) {
            var spaces = function (no) {
                if (no === 0) {
                    return '';
                }
                var space = ' ';
                for (var i = 0; i < no; i++) {
                    space += ' ';
                }
                return space;
            };
            var _printAttribute = function (jNode) {
                if (!jNode) {
                    return;
                }
                var arr = [];
                for (var i = 0; i < jNode.jAttr.jIndex.length; i++) {
                    arr.push(' ' + jNode.jAttr.jIndex[i] + '="' + jNode.jAttr[jNode.jAttr.jIndex[i]] + '"');
                }
                return arr.join('');
            }
            var _printNode = function (jNode, level) {
                if (!jNode) {
                    return;
                }
                var xml = '';
                if (jNode.jIndex) {
                    for (var j = 0; j < jNode.jIndex.length; j++) {
                        var node = jNode[jNode.jIndex[j][0]][jNode.jIndex[j][1]];
                        if (node.jIndex) {
                            xml += spaces(level) + '<' + jNode.jIndex[j][0] + _printAttribute(node) + '>\n' + _printNode(node, level + 1) + spaces(level) + '</' + jNode.jIndex[j][0] + '>\n';
                        } else {
                            xml += spaces(level) + '<' + jNode.jIndex[j][0] + _printAttribute(node) + '>' + node.jValue + '</' + jNode.jIndex[j][0] + '>\n';
                        }
                    }
                } else {
                    xml += spaces(level) + '<' + jNode.jName + _printAttribute(jNode) + '>' + jNode.jValue + '</' + jNode.jName + '>\n';
                }
                return xml;
            };
            if (jNode.length) {
                var xmlArr = [];
                for (var i = 0; i < jNode.length; i++) {
                    xmlArr.push(_printNode(jNode[i], 0))
                }
                return xmlArr;
            } else {
                return _printNode(jNode, 0);
            }
        }
    };

    window.X2J = X2J;

    //////////////////////////////////////////////////////////
    //////////////////////Constants///////////////////////
    //////////////////////////////////////////////////////////

    var ANY_TYPE = 0,                  //A result set containing whatever type naturally results from evaluation of the expression. Note that if the result is a node-set then UNORDERED_NODE_ITERATOR_TYPE is always the resulting type.
        NUMBER_TYPE = 1,                 //A result containing a single number. This is useful for example, in an XPath expression using the count() function.
        STRING_TYPE = 2,                 //A result containing a single string.
        BOOLEAN_TYPE = 3,                 //A result containing a single boolean value. This is useful for example, in an XPath expression using the not() function.
        UNORDERED_NODE_ITERATOR_TYPE = 4, //A result node-set containing all the nodes matching the expression. The nodes may not necessarily be in the same order that they appear in the document.
        ORDERED_NODE_ITERATOR_TYPE = 5, //A result node-set containing all the nodes matching the expression. The nodes in the result set are in the same order that they appear in the document.
        UNORDERED_NODE_SNAPSHOT_TYPE = 6, //A result node-set containing snapshots of all the nodes matching the expression. The nodes may not necessarily be in the same order that they appear in the document.
        ORDERED_NODE_SNAPSHOT_TYPE = 7, //A result node-set containing snapshots of all the nodes matching the expression. The nodes in the result set are in the same order that they appear in the document.
        ANY_UNORDERED_NODE_TYPE = 8, //A result node-set containing any single node that matches the expression. The node is not necessarily the first node in the document that matches the expression.
        FIRST_ORDERED_NODE_TYPE = 9;    //A result node-set containing the first node in the document that matches the expression.

    var XPathDict = {
        0: "ANY_TYPE",
        1: "NUMBER_TYPE",
        2: "STRING_TYPE",
        3: "BOOLEAN_TYPE",
        4: "UNORDERED_NODE_ITERATOR_TYPE",
        5: "ORDERED_NODE_ITERATOR_TYPE",
        6: "UNORDERED_NODE_SNAPSHOT_TYPE",
        7: "ORDERED_NODE_SNAPSHOT_TYPE",
        8: "ANY_UNORDERED_NODE_TYPE",
        9: "FIRST_ORDERED_NODE_TYPE"
    };

    var ELEMENT_NODE = 1,
    ATTRIBUTE_NODE = 2,
    TEXT_NODE = 3,
    DATA_SECTION_NODE = 4,
    ENTITY_REFERENCE_NODE = 5,
    ENTITY_NODE = 6,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11,
    NOTATION_NODE = 12

    var ElementDict = { 1: "ELEMENT_NODE",
        2: "ATTRIBUTE_NODE",
        3: "TEXT_NODE",
        4: "DATA_SECTION_NODE",
        5: "ENTITY_REFERENCE_NODE",
        6: "ENTITY_NODE",
        7: "PROCESSING_INSTRUCTION_NODE",
        8: "COMMENT_NODE",
        9: "DOCUMENT_NODE",
        10: "DOCUMENT_TYPE_NODE",
        11: "DOCUMENT_FRAGMENT_NODE",
        12: "NOTATION_NODE"
    };
} (window));