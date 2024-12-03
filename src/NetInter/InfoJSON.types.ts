type VideoID = number
type SegmentID = string
type Timestamp = number

export type GlobalStateID = string
export type PersistentStateID = string
export type StateValue = boolean | string | number
type StateHistory = {
  global: {
    [key: GlobalStateID]: StateValue
  }
  persistent: {
    [key: PersistentStateID]: StateValue
  }
}

// Decisions whether a precondition element is binary or Nary is 
// based on automated analyses of the *-info.json files
export type PCondID = string
export type PCondExp = 
  | PCondUnary 
  | PCondBinary 
  | PCondNary 
  | PCondVar
  | StateValue
type PCondVar = 
  | ["precondition", PCondID]
  | ["persistentState", PersistentStateID]
  | ["sessionState", string] 
  | ["globalState", GlobalStateID]
// unary
type PCondUnary = ["not", PCondExp]
type PCondBinary = [
  "eql" | "gt" | "gte" | "lt" | "or" | "mult" | "max", 
  PCondExp, 
  PCondExp
]
type PCondNary = ["and" | "sum", ...PCondExp[]]

export type PCondMap = {
  [key: PCondID]: PCondExp
}

type InteractiveType =
  "BRANCHING_TEMPLATES" // common for most interactives
  | "BATTLE_KITTY" // exclusive to "Battle Kitty"
  | "TRIVIA" // exclusive to "Cat Burglar"
  | "TRIVIA_QUEST"  // exclusive to "Trivia Quest"
  | "TRIVIAVERSE" // exclusive to "Triviaverse"

export type InfoJSON = {
  paths: [["videos", VideoID, "interactiveVideoMoments"]]
  jsonGraph: {
    videos: {
      [key: string]: {  // VideoID is converted to string when used as key
        interactiveVideoMoments: {
          $type: "atom",
          value: {
            stateHistory: StateHistory
            // snapshots: []
            // commonMetadata: {}
            preconditions: PCondMap
            // segmentGroups: {}
            momentsBySegment: {
              [key: SegmentID]: [
                {
                  startMS: Timestamp
                  endMS: Timestamp
                  // defaultChoiceIndex: 1,
                  // type: string,
                  // trackingInfo: {},
                  uiHideMS: Timestamp
                  // layoutType: "l1",
                  // activationWindow: []
                  id: SegmentID
                  choices: {
                    trackingInfo: {
                      id: SegmentID
                    }
                    background: {
                      visualStates: {
                        [K in "default" | "focused" | "selected"]: {
                          image: {
                            styles: {
                              backgroundSize: string // "w% h%"
                              backgroundPosition: string // "x% y%"
                            }
                            url: string
                          }
                        }
                      }
                    }
                    segmentId: SegmentID
                    id: SegmentID
                    text: string
                  }[]
                  // config: {}
                }
              ]
            }
            type: InteractiveType
            audioLocale: string // e.g. "en"
            playerControls: {
              choicePointsMetadata: {
                choicePoints: {
                  [key: SegmentID]: {
                    startTimeMs: Timestamp
                    description: string
                  }
                }
              }
              headerText: string
              // type: "snapshots"
            }
            // uiDefinition
            // segmentState?: {}
            playthroughCount?: number // user-based
            version?: string // exclusive to Triviaverse
          }
        }
      }
    }
  }
}
