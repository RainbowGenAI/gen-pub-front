export const Prompt = {
    ANALYZE_IMAGE : 'Please analyze the image and make a prompt\n' +
    'I will create an same image based on the prompt.\n' +
    // 'The image style is similar to the image below.\n' +
    // 'The image style can be changed by userPrompt.\n' +
    // 'Generated image size has to be under 4 MB.\n' +
    // 'Do not include any objects or backgrounds outside of the web screen in the image.\n' +
    // 'Exclude any unnecessary components or image elements and create a simple layout.\n' +
    // 'Exclude geometric icons and images as much as possible.\n' +
    // 'Exclude a cartoonish feel and create a layout with a serious and enterprise-oriented atmosphere.\n' +
    '[userInput]\n',

    // ANALYZE_IMAGE : 'I want to change the layout of a webpage to simplely fit samsung developer theme.\n' +
    // 'I aim to create an extremely simple theme that is convenient for introducing solutions and accessing the community on the webpage.\n' +
    // 'please refer to the developer portal website below : https://developer.apple.com/kr/discover/\\n' +
    // 'There is no background image, or blur it if necessary.\n' +
    // 'Use a maximum of four colors in the color palette: main color, sub-color, accent color, and negative color.\n' +
    // 'This webpage includes areas for introducing the solutions through text and showcasing an introductory video\n' +
    
    // 'Do not include any objects or backgrounds outside of the web screen in the image.\n' +
    // 'Exclude any unnecessary components or image elements and create a simple layout.\n' +
    // 'Exclude geometric icons and images as much as possible.\n' +
    // 'Exclude a cartoonish feel and create a layout with a serious and enterprise-oriented atmosphere.\n' +
    
    // 'This website is designed to introduce our four main products (Brity RPA, Brity Assistant, Brity Cognitive, Brity Automation Platform)and to create and expand the Brity Solution Developer Community.\n' +
    // 'Create components that allow users to navigate to detailed pages for each product.\n' +
    // 'Include all components from the given image, and generate the image with text labels inside the components as well.\n' +
    // 'The text included in the image is as follows:\n' +
    // 'Brityworks.ai Product Solution Community ® @ Q & Make yourse If more valuable Overvie\n',

    GENERATE_HTML_CODE : 'You are a html code generator.\n' +
    'Please generate html code based on the image below.\n' +
    'The input image is basically a image of a website or a wireframe for creating website\n' +
    'So the html code should be similar to image\n' +
    'You must answer in html code only.\n' +
    '[example]\n' +
    '<!DOCTYPE html><html lang="en"> <div></div> <div></div> <div></div> <div></div> </html>\n',

//     MODIFY_IMAGE : 'You are an image modifier that helps people modify web UI image. your task is to modify web UI image based on the given instructions.\n'
//     + 'Generated image size has to be under 4 MB.\n'
//     + 'These instructions will include image bounding boxes and specification to modify uploaded image into describe conditions.\n'
//     + 'Each instruction will be given following form and separated by characters @@@.\n'
//     + 'Below are examples of instruction.\n'
//     + '---\n'
// //    + '# OCR data\n'
// //    + '[[{bbox: {x: 1, y: 1, w: 3, h: 5}, text: test1}, {bbox: {x: 11, y: 11, w: 31, h: 51}, text: test2}], [{bbox: {x: 41, y: 41, w: 43, h: 45}, text: test3}]]\n'
// //    + '[[{bbox: {x: 1, y: 1, w: 3, h: 5}}, {bbox: {x: 11, y: 11, w: 31, h: 51}}], [{bbox: {x: 41, y: 41, w: 43, h: 45}}]]\n'
//     + '# Instructions\n'
//     + '- bounding box: {x: 10, y: 11, w: 30, h: 40}\n'
//     + '- specification: Change this button\'s text to \'cancel\'\n'
//     + '@@@\n'
//     + '- bounding box: {x: 20, y: 33, w: 50, h: 50}\n'
//     + '- specification: Change this component\'s background to yellow.\n'
//     + '---'
//     + 'Please modify attached image by following forms.\n'
//     + '---',

    MODIFY_IMAGE : 'This image is a web UI image.\n',
}
