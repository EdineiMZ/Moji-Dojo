/** "1 revisão" / "3 revisões": o número seguido da forma certa. */
export const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
