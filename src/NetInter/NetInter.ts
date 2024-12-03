import { create } from "zustand";
import { GlobalStateID, InfoJSON, PCondExp, PCondMap, PersistentStateID, StateValue } from "./InfoJSON.types";
import { SegmentJSON } from "./SegmentJSON.types";

type NetInter = {
  stateGlobal: { [key: GlobalStateID]: StateValue }
  statePersistent: { [key: PersistentStateID]: StateValue }
  pcondMap: PCondMap
  loadJsons: (segmentJson: SegmentJSON, infoJson: InfoJSON) => void
  evalPCondExp: (exp: PCondExp) => StateValue
}

const useNetInter = create<NetInter>((set, get) => ({
  stateGlobal: {},
  statePersistent: {},
  pcondMap: {},
  loadJsons: (segmentJson: SegmentJSON, infoJson: InfoJSON) => {
    const info = infoJson.jsonGraph.videos[infoJson.paths[0][1].toString()].interactiveVideoMoments.value;
    set({
      stateGlobal: info.stateHistory?.global,
      statePersistent: info.stateHistory?.persistent,
      pcondMap: info.preconditions
    });
  },
  evalPCondExp: (exp: PCondExp): StateValue => {
    if (!Array.isArray(exp))
      return exp

    const evalPCondMap = get().evalPCondExp
    switch (exp[0]) {
      case "not":
        return !evalPCondMap(exp[1])
      case "eql":
        return evalPCondMap(exp[1]) === evalPCondMap(exp[2])
      case "gt":
        return evalPCondMap(exp[1]) > evalPCondMap(exp[2])
      case "gte":
        return evalPCondMap(exp[1]) >= evalPCondMap(exp[2])
      case "lt":
        return evalPCondMap(exp[1]) < evalPCondMap(exp[2])
      case "or":
        return evalPCondMap(exp[1]) || evalPCondMap(exp[2])
      case "mult":
        return Number(evalPCondMap(exp[1])) * Number(evalPCondMap(exp[2]))
      case "max":
        return Math.max(Number(evalPCondMap(exp[1])), Number(evalPCondMap(exp[2])))
      case "and":
        return exp.slice(1).every(evalPCondMap)
      case "sum":
        return exp.slice(1).map((x) => Number(x)).reduce((acc, cur) => acc + cur, 0)
      case "precondition":
        return evalPCondMap(get().pcondMap[exp[1]])
      case "persistentState":
        return get().statePersistent[exp[1]]
      case "sessionState":
        return false
      case "globalState":
        return get().stateGlobal[exp[1]]
      default:
        return false
    }
  }
}));