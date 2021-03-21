import readline from 'readline';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Event: 'line'
rl.on('line', (arg) => {
  let result = reverseString(arg);
  console.log(result);
});

const reverseString =  (str) => {
  let stack = [];
  let result = '';

  for(const char of str) { 
    stack.push(char);
  }

  while(stack.length > 0) {

    result += stack.pop();
  }
  return result;
}