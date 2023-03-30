
export function getMock() {
  return [
    {
      id: '1',
      name: 'Stores',
    }, {
      id: '1_1',
      parentId: '1',
      name: 'Super Mart of the West',
    }, {
      id: '1_1_1',
      name: 'Video Players',
    }, {
      id: '1_1_1_1',
      parentId: '1_1_1',
      name: 'HD Video Player',
      icon: 'images/products/1.png',
      price: 220,
    }, {
      id: '1_1_2',
      parentId: '1_1',
      name: 'Televisions',
    }, {
      id: '1_1_3',
      parentId: '1_1',
      name: 'Monitors',
    }, {
      id: '1_1_3_1',
      name: 'DesktopLCD 25',
    }, {
      id: '1_1_3_1_1',
      parentId: '1',
      name: 'DesktopLCD 19',
      icon: 'images/products/10.png',
      price: 160,
    }, {
      id: '1_1_4',
      parentId: '1_1',
      name: 'Projectors',
    }, {
      id: '1_1_4_1',
      parentId: '1_1_4',
      name: 'Projector Plus',
      icon: 'images/products/14.png',
      price: 550,
    }, {
      id: '1_1_4_2',
      parentId: '1_1_4_1',
      name: 'Projector PlusHD',
      icon: 'images/products/15.png',
      price: 750,
    }, {
      id: '1_1_1_2',
      parentId: '1_1_1',
      name: 'SuperHD Video Player',
      icon: 'images/products/2.png',
      price: 270,
    },
  ];
}
