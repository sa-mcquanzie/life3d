import { Exits } from "./Exits"


export type Cell = {
  x: number
  z: number
  neighbours?: Cell[]
  exits: Exits
  visited: boolean
}
