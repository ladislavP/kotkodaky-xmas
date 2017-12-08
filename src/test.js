import API from './services/ApiService';

(async () => {
  try {
    await API.join('Kotkodaky_8', 'kikirik');
    const myPos = await API.getMyPosition();
    console.log(myPos);
    // const move = await API.move({x: 10, y: 2});
    // console.log(move);
  } catch (e) {
    console.log(e);
  }
})();
