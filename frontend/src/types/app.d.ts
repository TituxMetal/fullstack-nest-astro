declare namespace App {
  interface Locals {
    user: import('./user.types').User | undefined
  }
}

// declare namespace App {
//   interface APIContext {
//     user: import('./user.types').User | undefined
//   }
// }
