# Gen-pub
## Process
 |Step|Action or button|Description|
 |---|---|---|
 |1|Upload file|Wireframe 파일 업로드|
 |2|Create design|디자인 이미지 생성|
 |3|Labeling|이미지 위에 labeling 한다.(tag, description)|
 |4|Re-Design|Labeling 정보를 활용한 디자인 변경|
 |5|Publishing|생성된 디자인으로 html code 생성|

## What to do
 |Task|Done|comment|
 |---|:---:|---|
 |Frontend 구성|O|-| 
 |이미지 업로드|O|-|
 |OCR(tesseract)|O|한글 인식 안되는 현상 수정 필요|
 |Bootstrap|O|---|
 |OpenSeadragon|O|script 오류 수정|
 |Langchain + LLM|X|-|
 |Backend 구성(?)|X|-|
 |발표자료|X|스토리라인(?)|
 
## How to run
 1. git clone https://github.com/RainbowGenAI/gen-pub-front.git
 2. root 에 .env 파일 생성. env 파일에 api key 추가 
    - REACT_APP_OPENAI_API_KEY = 'your api key'      
 3. npm install
 4. run start

## Reference
- Bootstrap 
  - https://react-bootstrap.netlify.app/docs/getting-started/introduction
  - https://getbootstrap.kr/docs/5.0/forms/form-control/
- OpenSeadragon
  - https://github.com/annotorious/annotorious-openseadragon
- OpenAI
  - vision : https://platform.openai.com/docs/guides/vision
  - generate image : https://platform.openai.com/docs/guides/images
- LangChain 
  - for python : https://python.langchain.com/docs/get_started/introduction
  - for javascript : https://js.langchain.com/docs/get_started/introduction
- CSS Flex 
  - https://flexboxfroggy.com/#ko

## Vscode plugin
 - github copilot
 - markdown-viewer

## Benchmark
  - https://teleporthq.io/
