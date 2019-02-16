export const menColor = '#2b7ce9'
export const womenColor = '#aa00ff'

export const visOptions = {
  locale: 'ru',
  layout: {
    // improvedLayout: false,
    hierarchical: {
      // enabled: false, // def true if any attribute enable
      // levelSeparation: 200, // def 150
      sortMethod: "directed", //"hubsize"
      // parentCentralization: false, // def true
      // edgeMinimization: false, // def true
      // blockShifting: false, // def true
      // nodeSpacing: 200 // def 100
    }
  },
  physics: {
    // enabled: false, // def true. Быстрый рендеринг если false
  },
  nodes: {
    shape: 'icon',
    brokenImage: '/upload/image.jpeg',
    font: {
      strokeWidth: 7
    },
    borderWidth: 0
    // borderWidthSelected: 5
  },
  edges: {
    smooth: true,
    arrows: {
      to: true
    }
  },
  groups: {
    0: { //women
      icon: {
        face: 'FontAwesome',
        code: '\uf007',
        size: 50,
        color: womenColor
      },
      color: {
        border: womenColor
      } // arrow color
    },
    1: { //men
      // shape: 'icon',
      icon: {
        face: 'FontAwesome',
        code: '\uf007',
        size: 50,
        color: menColor
      }
    }
  },
  interaction: {
    hover: true,
    keyboard: {
      enabled: false, // если включено появляется голубая рамка
      bindToWindow: false // если true не работают кнопки - = х ъ
    },
    selectConnectedEdges: false,
    tooltipDelay: 100 // 300 ms default
  }
};