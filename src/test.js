import optimist from 'optimist';
import prompt from 'prompt';
import API from './services/ApiService';

prompt.start();

var schema = {
  properties: {
    username: {
      default: 'Kotkodaky_8'
    },
    password: {
      default: 'kikirik'
    }
  }
};

prompt.get(schema, async function (err, result) {
  try {
    await API.join(result.username, result.password);
    const myPos = await API.getMyPosition();
    console.log(myPos);
    // const move = await API.move({x: 10, y: 2});
    // console.log(move);
    if (optimist.argv.m === 'up') {
      const move = await API.move({x: myPos.x, y: myPos.y - 1});
      console.log(move);
    }
    if (optimist.argv.m === 'down') {
      const move = await API.move({x: myPos.x, y: myPos.y + 1});
      console.log(move);
    }
    if (optimist.argv.m === 'left') {
      const move = await API.move({x: myPos.x - 1, y: myPos.y});
      console.log(move);
    }
    if (optimist.argv.m === 'right') {
      const move = await API.move({x: myPos.x + 1, y: myPos.y});
      console.log(move);
    }
  } catch (e) {
    console.log(e);
  }
});
