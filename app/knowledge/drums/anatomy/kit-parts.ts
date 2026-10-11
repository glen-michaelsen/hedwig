/**
 * The parts of a standard five-piece kit, for the drawing and the page
 * text. Its own module, not inside the "use client" drawing, so the
 * server-rendered page can read the list too.
 */

export type KitPartKey = "hihat" | "crash" | "ride" | "snare" | "kick" | "rack-toms" | "floor-tom" | "pedals";

export const KIT_PARTS: { key: KitPartKey; name: string; size: string; does: string; tip: string }[] = [
  {
    key: "hihat",
    name: "Hi-hat",
    size: "Usually 14 inches",
    does: "Two cymbals on a stand, opened and closed with your left foot. Closed, it ticks; open, it rings. It keeps the steady pulse in most beats.",
    tip: "Play it with the tip of the stick, and keep your foot resting on the pedal so it stays closed.",
  },
  {
    key: "crash",
    name: "Crash cymbal",
    size: "Usually 16 to 18 inches",
    does: "The big splash for accents: the first hit of a chorus, the end of a fill. Loud, bright and short.",
    tip: "Hit it with a glancing blow from the side of the stick. Stabbing it straight on cracks cymbals.",
  },
  {
    key: "ride",
    name: "Ride cymbal",
    size: "Usually 20 to 22 inches",
    does: "A bigger, heavier cymbal that rides the rhythm instead of the hi-hat, often in choruses and jazz.",
    tip: "Play the middle of the cymbal for a clean ping. The bell, the bump in the centre, cuts through even more.",
  },
  {
    key: "snare",
    name: "Snare drum",
    size: "Usually 14 inches across",
    does: "Wires stretched under the bottom head give it the crack. It plays the backbeat, on 2 and 4 in most songs.",
    tip: "Hit the centre for a full sound. Hit the rim and the head together, a rimshot, for extra crack.",
  },
  {
    key: "kick",
    name: "Bass drum (kick)",
    size: "Usually 20 to 22 inches",
    does: "The biggest drum, played with a foot pedal. It's the low thump that locks in with the bass guitar.",
    tip: "Let the beater bounce off the head for a fuller sound. Pressing it into the head chokes the drum.",
  },
  {
    key: "rack-toms",
    name: "Rack toms",
    size: "Usually 10 and 12 inches",
    does: "Two smaller toms mounted on the bass drum. With the floor tom, they play the fills between beats.",
    tip: "Most fills move from high to low: small tom, bigger tom, floor tom, then a crash.",
  },
  {
    key: "floor-tom",
    name: "Floor tom",
    size: "Usually 14 or 16 inches",
    does: "The deepest tom, standing on its own legs. It ends fills with a big, low boom.",
    tip: "Tune it so it rings a little. Too tight, and it sounds like a big rack tom instead of a floor tom.",
  },
  {
    key: "pedals",
    name: "Pedals and throne",
    size: "Set them to fit you",
    does: "The bass drum pedal under your right foot, the hi-hat pedal under your left, and the throne, the drummer's stool.",
    tip: "Set the throne so your thighs slope slightly down. Too low, and your feet have to work twice as hard.",
  },
];
