import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text,
  Stack,
} from '@chakra-ui/react';


function CodeEditor() {
  const [inputCode, setInputCode] = useState(
    `function helloWorld() {\n  console.log('Hello, World!');\n}`
  );
  const [outputCode, setOutputCode] = useState('');
  const [action, setAction] = useState('codeConvert');
  const [targetLanguage, setTargetLanguage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [editorTheme, setEditorTheme] = useState('');

  const toggleEditorTheme = () => {
    setEditorTheme((currentTheme) =>
      currentTheme === 'vs-dark' ? 'vs' : 'vs-dark'
    );
  };

  const handleExecute = async () => {
    setLoading(true);

    try {
      const requestBody = {
        action: action,
        content: JSON.stringify(inputCode),
        targetLanguage: targetLanguage, // Include the selected target language
      };
console.log(requestBody)
      const response = await fetch("http://localhost:8080/openai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        const data = await response.json();
        setOutputCode(data.result);
      } else {
        setOutputCode("Error: An error occurred");
      }
    } catch (error) {
      console.log(error);
      setOutputCode("Error: An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" alignItems="center" p="20px" bg="gray.800">
      <Text fontSize="2xl" color="white" mb="4">
        Code Editor
      </Text>
      <Button colorScheme="blue" onClick={toggleEditorTheme} mb="4">
        Toggle Theme
      </Button>
      <Flex width="100%" justify="space-between" align="stretch" bg="gray.800">
        <Box w="50%">
          <FormControl>
            <FormLabel color="white">Input Code</FormLabel>
            <Editor
              height="70vh"
              defaultLanguage="javascript"
              defaultValue={inputCode}
              options={{
                fontSize: 18,
                theme: editorTheme,
              }}
              onChange={(value) => setInputCode(value)}
            />
          </FormControl>
        </Box>
        <Box w="50%">
          <FormControl>
            <FormLabel color="white">Output</FormLabel>
            <Editor
              height="70vh"
              language="javascript"
              value={outputCode}
              options={{
                readOnly: true,
                fontSize: 16,
                theme: editorTheme,
                wordWrap:"on"
              }}
            />
          </FormControl>
        </Box>
      </Flex>
      <Stack direction={['row']} spacing="4" align="center" bg="gray.800" mb={"10px"}>
        <FormControl>
          <FormLabel color="white">Action</FormLabel>
          <Select
            onChange={(e) => setAction(e.target.value)}
            value={action}
            bg="white"
            width={['100%', '200px']}
            colorScheme="blue"
          >
            <option value="codeConvert">Convert</option>
            <option value="debugCode">Debug</option>
            <option value="checkQuality">Quality Check</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel color="white">Target Language</FormLabel>
          <Select
            onChange={(e) => setTargetLanguage(e.target.value)}
            value={targetLanguage}
            bg="white"
            width={['100%', '200px']}
            colorScheme="blue"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            {/* Add more language options as needed */}
          </Select>
        </FormControl>
        
          </Stack>
          <Button colorScheme="blue" onClick={handleExecute} isLoading={loading} p="8px 20px">
          Execute
        </Button>
    </Flex>
  );
}

export default CodeEditor;
