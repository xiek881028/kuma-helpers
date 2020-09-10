import Permission from '@src/web/permission';

(async () => {
  const permission = new Permission({
    // permissionList: ['aaa', 'bbb'],
    // loop: false,
    saveName: 'yiyayiyayo',
    // sep: true,
    // window: true,
    // ajax() {
    //   return new Promise(resolve => {
    //     console.log(`~~~`);
    //     setTimeout(() => resolve(['aaa', 'bbb']), 1000);
    //   });
    // },
    // getFn: () => {
    //   return new Promise(resolve => {
    //     setTimeout(() => resolve(['aaa', 'bbb']), 1000);
    //   });
    // },
    // getFn: () => ['aaa', 'ccc'],
  });
  // (async () => console.log(`1`, await permission.hasPermissionSync(['aaa', 'bbb'], { sep: true })))();
  // (async () => console.log(`2`, await permission.hasPermissionSync(['aaa', 'ccc'], {
  //   saveName: 'bbb', window: true, getFn: () => {
  //     return new Promise(resolve => {
  //       setTimeout(() => resolve(['eee', 'bbb']), 5000);
  //     });
  //   }
  // })))();
  // (async () => console.log(`3`, await permission.hasPermissionSync(['aaa', 'ddd'], {
  //   permissionMode: '&',
  // })))();

  // permission.hasPermission(['aaa', 'bbb1'], res => {
  //   console.log(`4`, res);
  // }, {
  //   sep: true,
  //   saveName: 'aaa',
  //   window: true,
  // });
  // console.log('5', permission.hasPermission(['aaa', 'bbb1'], {
  //   // permissionMode: '&',
  //   // sep: true,
  //   saveName: 'bbb',
  //   window: true,
  // }));
  // console.log('6', await permission.hasPermissionSync(['aaa', 'bbb2'], {
  //   saveName: 'bbb',
  //   window: true,
  // }));
})();
