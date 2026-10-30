// Each topic is plain data. To add a topic, add another key to LESSONS.
// Tests run the student's real program: `input` lines are fed to input(), stdout must equal `expected`.
window.LESSONS = {
loops: {
  title: "Python Loops",
  description: "A loop repeats code so you don't have to write it again and again.",
  objectives: [
    "Repeat actions with a for loop and range()",
    "Loop over the items of a list",
    "Repeat until a condition changes with a while loop",
    "Stop early with break and avoid infinite loops"
  ],
  learn: [
    { h: "1. Why loops?",
      p: "Imagine brushing your teeth: you repeat the same motion many times. A loop tells Python to repeat a block of code for you.",
      code: `for i in range(3):
    print("Hello!")`,
      explain: "range(3) gives 0, 1, 2 — so the indented line runs 3 times." },
    { h: "2. The for loop and range()",
      p: "range(1, 6) starts at 1 and stops BEFORE 6. The loop variable takes each value in turn.",
      code: `for number in range(1, 6):
    print("Number", number)`,
      explain: "Prints Number 1 … Number 5. Indentation (4 spaces) shows what is inside the loop." },
    { h: "3. Looping over a list",
      p: "A for loop can walk through a list, one item at a time, without counting.",
      code: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("I like", fruit)`,
      explain: "fruit becomes \"apple\", then \"banana\", then \"cherry\"." },
    { h: "4. The while loop",
      p: "A while loop keeps going as long as its condition is True. Something inside the loop must eventually make it False!",
      code: `count = 3
while count > 0:
    print(count)
    count = count - 1
print("Liftoff!")`,
      explain: "If you forget count = count - 1 the loop never ends (an infinite loop). Python Lab will stop it after 5 seconds." },
    { h: "5. break: leave the loop early",
      p: "break jumps out of the loop immediately.",
      code: `for n in range(1, 10):
    if n == 4:
        break
    print(n)`,
      explain: "Prints 1, 2, 3 and stops when n reaches 4." }
  ],
  explore: { title: "Explore range()", intro: "Change the numbers. Each box is one trip around the loop." },
  exercises: [
    { id: "ex1", level: "Easy", title: "Count to five", xp: 20,
      prompt: "Use a for loop to print the numbers 1 to 5, one per line.",
      starter: "# Print 1 2 3 4 5 (one per line) using a for loop\n",
      hints: ["range(1, 6) gives 1 to 5.", "Start with: for number in range(1, 6):", "On the next line, indented 4 spaces: print(number)"],
      tests: [{ input: [], expected: "1\n2\n3\n4\n5" }] },
    { id: "ex2", level: "Medium", title: "Add them up", xp: 30, sample: "4",
      prompt: "The program reads a number n and should print 1 + 2 + … + n.\nFix the blank so it works.",
      starter: `n = int(input())
total = 0
for i in range(___):   # <- fill in the blank
    total = total + i
print(total)
`,
      hints: ["range(1, n) stops before n. What stop value includes n?", "Try range(1, n + 1)."],
      tests: [{ input: ["4"], expected: "10" }, { input: ["10"], expected: "55" }, { input: ["0"], expected: "0" }] },
    { id: "ex3", level: "Hard", title: "Stop at zero", xp: 50, sample: "3\n4\n10\n7\n0",
      prompt: "Keep reading whole numbers with input() until the user types 0 (don't count the 0).\nThen print two lines:\nTotal: <sum of the numbers>\nEven numbers: <how many were even>",
      starter: "# You don't know how many numbers will come, so which loop fits?\n",
      hints: ["Use a while loop: while True: ... and break when the number is 0.", "Start with total = 0 and evens = 0 before the loop.", "number % 2 == 0 is True for even numbers."],
      tests: [{ input: ["3", "4", "10", "7", "0"], expected: "Total: 24\nEven numbers: 2" },
              { input: ["0"], expected: "Total: 0\nEven numbers: 0" },
              { input: ["2", "0", "9"], expected: "Total: 2\nEven numbers: 1" }] }
  ],
  project: { id: "project", level: "Project", title: "Number Guessing Game", xp: 100, sample: "50\n30\n42",
    intro: "Build a game loop! The secret number is 42.",
    prompt: "Keep reading guesses with input() (no prompt text — tests compare output exactly).\nCount every guess.\nIf the guess is lower than the secret print: Too low!\nIf higher print: Too high!\nIf correct print: Correct! Guesses: N  — and stop looping.",
    starter: `secret = 42
guesses = 0

# Repeat until the player guesses the secret number
`,
    hints: ["The number of rounds is unknown, so use a while loop.", "Inside the loop: read guess = int(input()) and add 1 to guesses.", "Use if / elif / else to compare guess with secret, and break when correct."],
    tests: [{ input: ["50", "30", "42"], expected: "Too high!\nToo low!\nCorrect! Guesses: 3" },
            { input: ["42"], expected: "Correct! Guesses: 1" },
            { input: ["10", "20", "30", "40", "41", "43", "42"], expected: "Too low!\nToo low!\nToo low!\nToo low!\nToo low!\nToo high!\nCorrect! Guesses: 7" }] },
  badge: { id: "loop-master", name: "Loop Master", icon: "🔁" },
  skills: ["for loops", "range()", "while loops", "break", "loop conditions"],
  next: "Harder challenge (Code tab): give the player only 5 guesses using a for loop, and print Out of guesses! if they fail."
}
};
