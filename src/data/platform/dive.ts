/**
 * dive — JS playground exercises. Each exercise gives the learner a brief
 * and starter code they can edit, run, and iterate on inside the browser.
 */

export interface DiveExercise {
  id: string;
  title: string;
  brief: string;
  starter: string;
}

export const diveExercises: DiveExercise[] = [
  {
    id: 'sum-array',
    title: 'Sum an array',
    brief:
      'Write a function that takes an array of numbers and returns their total. Use Array.reduce — no for loops allowed.',
    starter: `function sumArray(nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

console.log(sumArray([1, 2, 3, 4, 5]));   // 15
console.log(sumArray([10, -3, 7]));        // 14
console.log(sumArray([]));                 // 0
`,
  },
  {
    id: 'reverse-string',
    title: 'Reverse a string',
    brief:
      'Write a one-liner that reverses a string. Then extend it to also detect whether the original is a palindrome.',
    starter: `function reverse(str) {
  return str.split('').reverse().join('');
}

function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === reverse(clean);
}

console.log(reverse('hello'));           // 'olleh'
console.log(isPalindrome('racecar'));    // true
console.log(isPalindrome('north'));      // false
`,
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    brief:
      'Print 1–30. Multiples of 3 → "Fizz", multiples of 5 → "Buzz", multiples of both → "FizzBuzz". No if-else chains.',
    starter: `for (let i = 1; i <= 30; i++) {
  const fizz = i % 3 === 0 ? 'Fizz' : '';
  const buzz = i % 5 === 0 ? 'Buzz' : '';
  console.log(fizz + buzz || i);
}
`,
  },
  {
    id: 'debounce',
    title: 'Debounce',
    brief:
      'Implement a debounce function: it returns a new function that only fires after the caller stops invoking it for `delay` ms. Test it with a simulated rapid call sequence.',
    starter: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Simulation: call quickly, only the last should fire.
let calls = 0;
const log = debounce((msg) => {
  calls++;
  console.log('fired:', msg, '(call #' + calls + ')');
}, 200);

// In a real browser these would be time-spaced;
// here we just show the setup is correct.
log('a');
log('b');
log('c');
console.log('debounced function created — final call wins after 200 ms');
`,
  },
];
