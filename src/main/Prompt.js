export const Prompt = {
    ANALYZE_IMAGE : 'Please analyze the image and make a prompt\n' +
    'I will create an same image based on the prompt.\n' +
    'The image style is similar to the image below.\n' +
    'The image style can be changed by userPrompt.\n' +
    'Generated image size has to be under 4 MB.\n' +
    '[userInput]\n',

    GENERATE_HTML_CODE : 'You are a html code generator.\n' +
    'Please generate html code based on the image below.\n' +
    'The input image is basically a image of a website or a wireframe for creating website\n' +
    'So the html code should be similar to image\n' +
    'You must answer in html code only.\n' +
    '[example]\n' +
    '<!DOCTYPE html><html lang="en"> <div></div> <div></div> <div></div> <div></div> </html>\n',

    MODIFY_IMAGE : 'You are an image modifier that helps people modify web UI image. your task is to modify web UI image based on the given instructions.\n'
    + 'Generated image size has to be under 4 MB.\n'
    + 'These instructions will include image bounding boxes and specification to modify uploaded image into describe conditions.\n'
    + 'Each instruction will be given following form and separated by characters @@@.\n'
    + 'Below are examples of instruction.\n'
    + '---\n'
//    + '# OCR data\n'
//    + '[[{bbox: {x: 1, y: 1, w: 3, h: 5}, text: test1}, {bbox: {x: 11, y: 11, w: 31, h: 51}, text: test2}], [{bbox: {x: 41, y: 41, w: 43, h: 45}, text: test3}]]\n'
//    + '[[{bbox: {x: 1, y: 1, w: 3, h: 5}}, {bbox: {x: 11, y: 11, w: 31, h: 51}}], [{bbox: {x: 41, y: 41, w: 43, h: 45}}]]\n'
    + '# Instructions\n'
    + '- bounding box: {x: 10, y: 11, w: 30, h: 40}\n'
    + '- specification: Change this button\'s text to \'cancel\'\n'
    + '@@@\n'
    + '- bounding box: {x: 20, y: 33, w: 50, h: 50}\n'
    + '- specification: Change this component\'s background to yellow.\n'
    + '---'
    + 'Please modify attached image by following forms.\n'
    + '---',


}
