export const unique = (x, i, self) => self.indexOf(x) === i
export const count = test => (total, it) => test(it) ? ++total : total
export const total = test => (total, it) => (test == null || test(it)) ? total + it : total
