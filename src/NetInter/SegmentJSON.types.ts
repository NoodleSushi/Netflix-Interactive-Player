type SegmentID = string
type Timestamp = number

type Segment = {
  nrd41StartTimeMs?: Timestamp
  startTimeMs: Timestamp
  endTimeMs?: Timestamp
  ui?: {
    interactionZones?: [Timestamp[]]
    interactionZonesV2?: [Timestamp[]]
  }
  next: {
    [key: SegmentID]: {
      weight: number
    }
  }
  defaultNext?: SegmentID
  credits?: boolean
}

export type SegmentJSON = {
  viewableId: number
  type: "branching"
  choiceMapSpecVersion?: 1
  bmVersion?: string
  ui?: {
    resetBookmarkInCredits: boolean
  }
  initialSegment: SegmentID
  segments: {
    [key: SegmentID]: Segment
  }
}