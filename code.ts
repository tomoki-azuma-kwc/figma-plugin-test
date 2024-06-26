// // This file holds the main code for plugins. Code in this file has access to
// // the *figma document* via the figma global object.
// // You can access browser APIs in the <script> tag inside "ui.html" which has a
// // full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// // Runs this code if the plugin is run in Figma
// if (figma.editorType === 'figma') {
//   // This plugin will open a window to prompt the user to enter a number, and
//   // it will then create that many rectangles on the screen.

//   // This shows the HTML page in "ui.html".
//   figma.showUI(__html__);

//   // Calls to "parent.postMessage" from within the HTML page will trigger this
//   // callback. The callback will be passed the "pluginMessage" property of the
//   // posted message.
//   figma.ui.onmessage =  (msg: {type: string, count: number}) => {
//     // One way of distinguishing between different types of messages sent from
//     // your HTML page is to use an object with a "type" property like this.
//     if (msg.type === 'create-shapes') {
//       const nodes: SceneNode[] = [];
//       for (let i = 0; i < msg.count; i++) {
//         const rect = figma.createRectangle();
//         rect.x = i * 150;
//         rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//         figma.currentPage.appendChild(rect);
//         nodes.push(rect);
//       }
//       figma.currentPage.selection = nodes;
//       figma.viewport.scrollAndZoomIntoView(nodes);
//     }

//     // Make sure to close the plugin when you're done. Otherwise the plugin will
//     // keep running, which shows the cancel button at the bottom of the screen.
//     figma.closePlugin();
//   };
// }


if (figma.editorType === 'figma') {
  figma.showUI(__html__);
  let localColorStyles = [];
  let selectColorStyles = [];
  figma.ui.onmessage =  (msg: {type: string}) => {
    if (msg.type === 'get-colors') {
      figma.getLocalPaintStylesAsync().then(data => {
        localColorStyles = data.map(element => {
          // 選択したフレーム内のカラーと照合するため、idとcolorが必須
          return {
            id: element.id,
            name: element.name,
            color: element.paints[0].color,
          };
        });
        console.log(localColorStyles);
      });
    }
    if (msg.type === 'check-frame') {
      // キャンバス上で現在選択中のフレームからカラー情報を取得する
      figma.currentPage.selection.forEach(frame => {
        selectColorStyles = frame.children.map(object => {
          return {
            frameId: frame.id,
            id: object.fillStyleId,
            color: object.fills[0].color,
          }
        });
        // console.log(selectColorStyles);
      });
      const alertColors = selectColorStyles.filter(selectColor => {
        // console.log(selectColor, localColorStyles);
        return localColorStyles.find(localColor => {
          return selectColor.id === localColor.id;
        });
      });
      console.log(alertColors);
    }
    // figma.closePlugin();
  };
}