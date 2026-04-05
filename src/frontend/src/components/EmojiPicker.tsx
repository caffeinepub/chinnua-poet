import { useState } from "react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

// Build Noto Emoji animated GIF URL from an emoji character
function notoEmojiUrl(emoji: string): string {
  const codepoints = [...emoji]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((cp) => cp !== "fe0f") // remove variation selectors
    .join("_");
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoints}/512.gif`;
}

interface EmojiEntry {
  char: string;
  name: string;
}

interface EmojiCategory {
  label: string;
  icon: string;
  emojis: EmojiEntry[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    label: "Smileys",
    icon: "😀",
    emojis: [
      { char: "😀", name: "grinning face" },
      { char: "😃", name: "grinning face with big eyes" },
      { char: "😄", name: "grinning face with smiling eyes" },
      { char: "😁", name: "beaming face" },
      { char: "😆", name: "grinning squinting face" },
      { char: "😅", name: "grinning face with sweat" },
      { char: "🤣", name: "rolling on the floor laughing" },
      { char: "😂", name: "face with tears of joy" },
      { char: "🙂", name: "slightly smiling face" },
      { char: "🙃", name: "upside-down face" },
      { char: "😉", name: "winking face" },
      { char: "😊", name: "smiling face with smiling eyes" },
      { char: "😇", name: "smiling face with halo" },
      { char: "🥰", name: "smiling face with hearts" },
      { char: "😍", name: "smiling face with heart-eyes" },
      { char: "🤩", name: "star-struck" },
      { char: "😘", name: "face blowing a kiss" },
      { char: "😗", name: "kissing face" },
      { char: "😚", name: "kissing face with closed eyes" },
      { char: "😙", name: "kissing face with smiling eyes" },
      { char: "🥲", name: "smiling face with tear" },
      { char: "😋", name: "face savoring food" },
      { char: "😛", name: "face with tongue" },
      { char: "😜", name: "winking face with tongue" },
      { char: "🤪", name: "zany face" },
      { char: "😝", name: "squinting face with tongue" },
      { char: "🤑", name: "money-mouth face" },
      { char: "🤗", name: "hugging face" },
      { char: "🤭", name: "face with hand over mouth" },
      { char: "🤫", name: "shushing face" },
      { char: "🤔", name: "thinking face" },
      { char: "🤐", name: "zipper-mouth face" },
      { char: "🤨", name: "face with raised eyebrow" },
      { char: "😐", name: "neutral face" },
      { char: "😑", name: "expressionless face" },
      { char: "😶", name: "face without mouth" },
      { char: "😏", name: "smirking face" },
      { char: "😒", name: "unamused face" },
      { char: "🙄", name: "face with rolling eyes" },
      { char: "😬", name: "grimacing face" },
      { char: "🤥", name: "lying face" },
      { char: "😌", name: "relieved face" },
      { char: "😔", name: "pensive face" },
      { char: "😪", name: "sleepy face" },
      { char: "🤤", name: "drooling face" },
      { char: "😴", name: "sleeping face" },
      { char: "😷", name: "face with medical mask" },
      { char: "🤒", name: "face with thermometer" },
      { char: "🤕", name: "face with head-bandage" },
      { char: "🤢", name: "nauseated face" },
      { char: "🤮", name: "face vomiting" },
      { char: "🤧", name: "sneezing face" },
      { char: "🥵", name: "hot face" },
      { char: "🥶", name: "cold face" },
      { char: "🥴", name: "woozy face" },
      { char: "😵", name: "dizzy face" },
      { char: "🤯", name: "exploding head" },
      { char: "🤠", name: "cowboy hat face" },
      { char: "🥸", name: "disguised face" },
      { char: "😎", name: "smiling face with sunglasses" },
      { char: "🤓", name: "nerd face" },
      { char: "🧐", name: "face with monocle" },
      { char: "😕", name: "confused face" },
      { char: "😟", name: "worried face" },
      { char: "🙁", name: "slightly frowning face" },
      { char: "😮", name: "face with open mouth" },
      { char: "😯", name: "hushed face" },
      { char: "😲", name: "astonished face" },
      { char: "😳", name: "flushed face" },
      { char: "🥺", name: "pleading face" },
      { char: "😦", name: "frowning face with open mouth" },
      { char: "😧", name: "anguished face" },
      { char: "😨", name: "fearful face" },
      { char: "😰", name: "anxious face with sweat" },
      { char: "😥", name: "sad but relieved face" },
      { char: "😢", name: "crying face" },
      { char: "😭", name: "loudly crying face" },
      { char: "😱", name: "face screaming in fear" },
      { char: "😖", name: "confounded face" },
      { char: "😣", name: "persevering face" },
      { char: "😞", name: "disappointed face" },
      { char: "😓", name: "downcast face with sweat" },
      { char: "😩", name: "weary face" },
      { char: "😫", name: "tired face" },
      { char: "🥱", name: "yawning face" },
      { char: "😤", name: "face with steam from nose" },
      { char: "😡", name: "pouting face" },
      { char: "😠", name: "angry face" },
      { char: "🤬", name: "face with symbols on mouth" },
      { char: "😈", name: "smiling face with horns" },
      { char: "👿", name: "angry face with horns" },
      { char: "💀", name: "skull" },
      { char: "💩", name: "pile of poo" },
      { char: "🤡", name: "clown face" },
      { char: "👹", name: "ogre" },
      { char: "👺", name: "goblin" },
      { char: "👻", name: "ghost" },
      { char: "👽", name: "alien" },
      { char: "👾", name: "alien monster" },
      { char: "🤖", name: "robot" },
    ],
  },
  {
    label: "Hearts",
    icon: "❤️",
    emojis: [
      { char: "❤️", name: "red heart" },
      { char: "🧡", name: "orange heart" },
      { char: "💛", name: "yellow heart" },
      { char: "💚", name: "green heart" },
      { char: "💙", name: "blue heart" },
      { char: "💜", name: "purple heart" },
      { char: "🖤", name: "black heart" },
      { char: "🤍", name: "white heart" },
      { char: "🤎", name: "brown heart" },
      { char: "💔", name: "broken heart" },
      { char: "❣️", name: "heart exclamation" },
      { char: "💕", name: "two hearts" },
      { char: "💞", name: "revolving hearts" },
      { char: "💓", name: "beating heart" },
      { char: "💗", name: "growing heart" },
      { char: "💖", name: "sparkling heart" },
      { char: "💘", name: "heart with arrow" },
      { char: "💝", name: "heart with ribbon" },
      { char: "💟", name: "heart decoration" },
      { char: "☮️", name: "peace symbol" },
      { char: "✨", name: "sparkles" },
      { char: "💫", name: "dizzy" },
      { char: "⭐", name: "star" },
      { char: "🌟", name: "glowing star" },
      { char: "💥", name: "collision" },
      { char: "🔥", name: "fire" },
      { char: "🌸", name: "cherry blossom" },
      { char: "🌹", name: "rose" },
      { char: "🌺", name: "hibiscus" },
      { char: "🌻", name: "sunflower" },
      { char: "🌷", name: "tulip" },
      { char: "💐", name: "bouquet" },
      { char: "🌼", name: "blossom" },
    ],
  },
  {
    label: "Nature",
    icon: "🌿",
    emojis: [
      { char: "🐶", name: "dog" },
      { char: "🐱", name: "cat" },
      { char: "🐭", name: "mouse" },
      { char: "🐹", name: "hamster" },
      { char: "🐰", name: "rabbit" },
      { char: "🦊", name: "fox" },
      { char: "🐻", name: "bear" },
      { char: "🐼", name: "panda" },
      { char: "🐨", name: "koala" },
      { char: "🐯", name: "tiger" },
      { char: "🦁", name: "lion" },
      { char: "🐮", name: "cow" },
      { char: "🐷", name: "pig" },
      { char: "🐸", name: "frog" },
      { char: "🐵", name: "monkey" },
      { char: "🐔", name: "chicken" },
      { char: "🐧", name: "penguin" },
      { char: "🐦", name: "bird" },
      { char: "🐤", name: "baby chick" },
      { char: "🦆", name: "duck" },
      { char: "🦅", name: "eagle" },
      { char: "🦉", name: "owl" },
      { char: "🦇", name: "bat" },
      { char: "🐝", name: "honeybee" },
      { char: "🦋", name: "butterfly" },
      { char: "🐌", name: "snail" },
      { char: "🐞", name: "ladybug" },
      { char: "🐜", name: "ant" },
      { char: "🦟", name: "mosquito" },
      { char: "🌿", name: "herb" },
      { char: "🍃", name: "leaf fluttering in wind" },
      { char: "🍂", name: "fallen leaf" },
      { char: "🍁", name: "maple leaf" },
      { char: "🌊", name: "water wave" },
      { char: "🌙", name: "crescent moon" },
      { char: "🌛", name: "first quarter moon face" },
      { char: "🌝", name: "full moon face" },
      { char: "🌞", name: "sun with face" },
      { char: "🌈", name: "rainbow" },
      { char: "⭐", name: "star" },
      { char: "🌟", name: "glowing star" },
      { char: "⛅", name: "sun behind cloud" },
      { char: "🌤️", name: "sun behind small cloud" },
      { char: "🌥️", name: "sun behind large cloud" },
      { char: "🌦️", name: "sun behind rain cloud" },
      { char: "🌧️", name: "cloud with rain" },
      { char: "⛈️", name: "cloud with lightning and rain" },
      { char: "🌩️", name: "cloud with lightning" },
      { char: "🌨️", name: "cloud with snow" },
      { char: "🌬️", name: "wind face" },
      { char: "🌪️", name: "tornado" },
      { char: "🌫️", name: "fog" },
      { char: "❄️", name: "snowflake" },
      { char: "☃️", name: "snowman" },
      { char: "⛄", name: "snowman without snow" },
    ],
  },
  {
    label: "Food",
    icon: "🍎",
    emojis: [
      { char: "🍎", name: "red apple" },
      { char: "🍐", name: "pear" },
      { char: "🍊", name: "tangerine" },
      { char: "🍋", name: "lemon" },
      { char: "🍌", name: "banana" },
      { char: "🍉", name: "watermelon" },
      { char: "🍇", name: "grapes" },
      { char: "🍓", name: "strawberry" },
      { char: "🫐", name: "blueberries" },
      { char: "🍈", name: "melon" },
      { char: "🍒", name: "cherries" },
      { char: "🍑", name: "peach" },
      { char: "🥭", name: "mango" },
      { char: "🍍", name: "pineapple" },
      { char: "🥥", name: "coconut" },
      { char: "🥝", name: "kiwi fruit" },
      { char: "🍅", name: "tomato" },
      { char: "🍆", name: "eggplant" },
      { char: "🥑", name: "avocado" },
      { char: "🥦", name: "broccoli" },
      { char: "🥬", name: "leafy green" },
      { char: "🥒", name: "cucumber" },
      { char: "🌶️", name: "hot pepper" },
      { char: "🫑", name: "bell pepper" },
      { char: "🧄", name: "garlic" },
      { char: "🧅", name: "onion" },
      { char: "🥔", name: "potato" },
      { char: "🍠", name: "roasted sweet potato" },
      { char: "🌰", name: "chestnut" },
      { char: "🥜", name: "peanuts" },
      { char: "🍞", name: "bread" },
      { char: "🥐", name: "croissant" },
      { char: "🧀", name: "cheese wedge" },
      { char: "🍕", name: "pizza" },
      { char: "🍔", name: "hamburger" },
      { char: "🍟", name: "french fries" },
      { char: "🌭", name: "hot dog" },
      { char: "🥪", name: "sandwich" },
      { char: "🥙", name: "stuffed flatbread" },
      { char: "🌮", name: "taco" },
      { char: "🌯", name: "burrito" },
      { char: "🥗", name: "green salad" },
      { char: "🍜", name: "steaming bowl" },
      { char: "🍝", name: "spaghetti" },
      { char: "🍛", name: "curry rice" },
      { char: "🍣", name: "sushi" },
      { char: "🍱", name: "bento box" },
      { char: "🍦", name: "soft ice cream" },
      { char: "🍧", name: "shaved ice" },
      { char: "🍨", name: "ice cream" },
      { char: "🍩", name: "doughnut" },
      { char: "🍪", name: "cookie" },
      { char: "🎂", name: "birthday cake" },
      { char: "🍰", name: "shortcake" },
      { char: "🧁", name: "cupcake" },
      { char: "☕", name: "hot beverage" },
      { char: "🍵", name: "teacup without handle" },
      { char: "🧋", name: "bubble tea" },
      { char: "🍺", name: "beer mug" },
      { char: "🍻", name: "clinking beer mugs" },
      { char: "🥂", name: "clinking glasses" },
      { char: "🍷", name: "wine glass" },
      { char: "🧃", name: "beverage box" },
      { char: "🥤", name: "cup with straw" },
      { char: "🧊", name: "ice" },
    ],
  },
  {
    label: "Activities",
    icon: "⚽",
    emojis: [
      { char: "⚽", name: "soccer ball" },
      { char: "🏀", name: "basketball" },
      { char: "🏈", name: "american football" },
      { char: "⚾", name: "baseball" },
      { char: "🎾", name: "tennis" },
      { char: "🏐", name: "volleyball" },
      { char: "🏉", name: "rugby football" },
      { char: "🥏", name: "flying disc" },
      { char: "🎱", name: "pool 8 ball" },
      { char: "🏓", name: "ping pong" },
      { char: "🏸", name: "badminton" },
      { char: "🥍", name: "lacrosse" },
      { char: "🏒", name: "ice hockey" },
      { char: "🥅", name: "goal net" },
      { char: "⛳", name: "flag in hole" },
      { char: "🎯", name: "direct hit" },
      { char: "🎮", name: "video game" },
      { char: "🎲", name: "game die" },
      { char: "♟️", name: "chess pawn" },
      { char: "🎭", name: "performing arts" },
      { char: "🎨", name: "artist palette" },
      { char: "🎪", name: "circus tent" },
      { char: "🎤", name: "microphone" },
      { char: "🎧", name: "headphone" },
      { char: "🎵", name: "musical note" },
      { char: "🎶", name: "musical notes" },
      { char: "🎸", name: "guitar" },
      { char: "🎹", name: "musical keyboard" },
      { char: "🎺", name: "trumpet" },
      { char: "🎻", name: "violin" },
      { char: "🥁", name: "drum" },
      { char: "🎷", name: "saxophone" },
      { char: "📖", name: "open book" },
      { char: "📝", name: "memo" },
      { char: "✒️", name: "black nib" },
      { char: "🖊️", name: "pen" },
      { char: "🖋️", name: "fountain pen" },
      { char: "🪶", name: "feather" },
      { char: "📜", name: "scroll" },
      { char: "📚", name: "books" },
      { char: "🕯️", name: "candle" },
      { char: "🌌", name: "milky way" },
      { char: "💭", name: "thought balloon" },
      { char: "🌅", name: "sunrise" },
      { char: "🌄", name: "sunrise over mountains" },
      { char: "🌠", name: "shooting star" },
    ],
  },
  {
    label: "Objects",
    icon: "📱",
    emojis: [
      { char: "📱", name: "mobile phone" },
      { char: "💻", name: "laptop" },
      { char: "🖥️", name: "desktop computer" },
      { char: "🖨️", name: "printer" },
      { char: "⌨️", name: "keyboard" },
      { char: "📷", name: "camera" },
      { char: "📸", name: "camera with flash" },
      { char: "📹", name: "video camera" },
      { char: "🎥", name: "movie camera" },
      { char: "📺", name: "television" },
      { char: "📻", name: "radio" },
      { char: "🎙️", name: "studio microphone" },
      { char: "📡", name: "satellite antenna" },
      { char: "☎️", name: "telephone" },
      { char: "📞", name: "telephone receiver" },
      { char: "📟", name: "pager" },
      { char: "💡", name: "light bulb" },
      { char: "🔦", name: "flashlight" },
      { char: "🕯️", name: "candle" },
      { char: "🪔", name: "diya lamp" },
      { char: "💰", name: "money bag" },
      { char: "💳", name: "credit card" },
      { char: "💎", name: "gem stone" },
      { char: "⚖️", name: "balance scale" },
      { char: "🔑", name: "key" },
      { char: "🗝️", name: "old key" },
      { char: "🔒", name: "locked" },
      { char: "🔓", name: "unlocked" },
      { char: "🔨", name: "hammer" },
      { char: "⚙️", name: "gear" },
      { char: "🔧", name: "wrench" },
      { char: "🔩", name: "nut and bolt" },
      { char: "🧲", name: "magnet" },
      { char: "🪜", name: "ladder" },
      { char: "🧴", name: "lotion bottle" },
      { char: "🧷", name: "safety pin" },
      { char: "🧹", name: "broom" },
      { char: "🧺", name: "basket" },
      { char: "🧻", name: "roll of paper" },
      { char: "🪣", name: "bucket" },
      { char: "🧼", name: "soap" },
      { char: "🪥", name: "toothbrush" },
      { char: "🛒", name: "shopping cart" },
      { char: "📦", name: "package" },
      { char: "📫", name: "closed mailbox with raised flag" },
      { char: "📬", name: "open mailbox with raised flag" },
      { char: "📭", name: "open mailbox with lowered flag" },
      { char: "📮", name: "postbox" },
      { char: "✏️", name: "pencil" },
      { char: "📌", name: "pushpin" },
      { char: "📎", name: "paperclip" },
    ],
  },
  {
    label: "Symbols",
    icon: "💯",
    emojis: [
      { char: "❤️", name: "red heart" },
      { char: "💯", name: "hundred points" },
      { char: "✅", name: "check mark button" },
      { char: "☑️", name: "check box with check" },
      { char: "🔴", name: "red circle" },
      { char: "🟠", name: "orange circle" },
      { char: "🟡", name: "yellow circle" },
      { char: "🟢", name: "green circle" },
      { char: "🔵", name: "blue circle" },
      { char: "🟣", name: "purple circle" },
      { char: "⚫", name: "black circle" },
      { char: "⚪", name: "white circle" },
      { char: "🟤", name: "brown circle" },
      { char: "🔺", name: "red triangle up" },
      { char: "🔻", name: "red triangle down" },
      { char: "💠", name: "diamond with a dot" },
      { char: "🔷", name: "large blue diamond" },
      { char: "🔶", name: "large orange diamond" },
      { char: "🔹", name: "small blue diamond" },
      { char: "🔸", name: "small orange diamond" },
      { char: "▶️", name: "play button" },
      { char: "⏩", name: "fast-forward button" },
      { char: "⏪", name: "fast reverse button" },
      { char: "⏫", name: "fast up button" },
      { char: "⏬", name: "fast down button" },
      { char: "◀️", name: "reverse button" },
      { char: "🔼", name: "up button" },
      { char: "🔽", name: "down button" },
      { char: "⏸️", name: "pause button" },
      { char: "⏹️", name: "stop button" },
      { char: "⏺️", name: "record button" },
      { char: "🎦", name: "cinema" },
      { char: "🔅", name: "dim button" },
      { char: "🔆", name: "bright button" },
      { char: "📶", name: "antenna bars" },
      { char: "📳", name: "vibration mode" },
      { char: "📴", name: "mobile phone off" },
      { char: "♻️", name: "recycling symbol" },
      { char: "🔱", name: "trident emblem" },
      { char: "📛", name: "name badge" },
      { char: "🔰", name: "Japanese symbol for beginner" },
      { char: "⭕", name: "hollow red circle" },
      { char: "❎", name: "cross mark button" },
      { char: "🆗", name: "OK button" },
      { char: "🆙", name: "UP button" },
      { char: "🆕", name: "NEW button" },
      { char: "🆓", name: "FREE button" },
      { char: "🈵", name: "Japanese no vacancy button" },
    ],
  },
  {
    label: "Flags",
    icon: "🏳️",
    emojis: [
      { char: "🏳️", name: "white flag" },
      { char: "🏴", name: "black flag" },
      { char: "🚩", name: "triangular flag" },
      { char: "🏁", name: "chequered flag" },
      { char: "🏴‍☠️", name: "pirate flag" },
      { char: "🏳️‍🌈", name: "rainbow flag" },
      { char: "🏳️‍⚧️", name: "transgender flag" },
      { char: "🇺🇳", name: "flag: United Nations" },
      { char: "🇺🇸", name: "flag: United States" },
      { char: "🇬🇧", name: "flag: United Kingdom" },
      { char: "🇨🇦", name: "flag: Canada" },
      { char: "🇦🇺", name: "flag: Australia" },
      { char: "🇫🇷", name: "flag: France" },
      { char: "🇩🇪", name: "flag: Germany" },
      { char: "🇯🇵", name: "flag: Japan" },
      { char: "🇨🇳", name: "flag: China" },
      { char: "🇮🇳", name: "flag: India" },
      { char: "🇧🇷", name: "flag: Brazil" },
      { char: "🇷🇺", name: "flag: Russia" },
      { char: "🇿🇦", name: "flag: South Africa" },
      { char: "🇳🇬", name: "flag: Nigeria" },
      { char: "🇰🇷", name: "flag: South Korea" },
      { char: "🇪🇸", name: "flag: Spain" },
      { char: "🇮🇹", name: "flag: Italy" },
      { char: "🇲🇽", name: "flag: Mexico" },
      { char: "🇵🇹", name: "flag: Portugal" },
      { char: "🇳🇱", name: "flag: Netherlands" },
      { char: "🇵🇱", name: "flag: Poland" },
      { char: "🇸🇪", name: "flag: Sweden" },
      { char: "🇳🇴", name: "flag: Norway" },
    ],
  },
];

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");

  const currentEmojis = search.trim()
    ? EMOJI_CATEGORIES.flatMap((c) =>
        c.emojis.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.char.includes(search),
        ),
      )
    : (EMOJI_CATEGORIES[activeCategory]?.emojis ?? []);

  return (
    <div
      style={{
        background: "#FFF8EE",
        border: "1px solid rgba(139,111,71,0.25)",
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(92,61,46,0.18)",
        width: 320,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        maxHeight: 360,
      }}
      data-ocid="emoji_picker.panel"
    >
      {/* Search bar */}
      <div style={{ padding: "0.6rem 0.6rem 0" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          data-ocid="emoji_picker.search_input"
          style={{
            width: "100%",
            background: "rgba(245,236,215,0.7)",
            border: "1px solid rgba(212,168,83,0.3)",
            borderRadius: 8,
            padding: "0.35rem 0.65rem",
            fontSize: "0.78rem",
            color: "#3D2B1F",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            outline: "none",
            boxSizing: "border-box" as const,
          }}
        />
      </div>

      {/* Category tabs */}
      {!search.trim() && (
        <div
          style={{
            display: "flex",
            gap: "2px",
            padding: "0.4rem 0.6rem 0",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setActiveCategory(i)}
              data-ocid="emoji_picker.tab"
              title={cat.label}
              style={{
                padding: "0.2rem 0.5rem",
                borderRadius: 6,
                border:
                  activeCategory === i
                    ? "1px solid rgba(212,168,83,0.5)"
                    : "1px solid rgba(139,111,71,0.15)",
                background:
                  activeCategory === i
                    ? "rgba(212,168,83,0.15)"
                    : "transparent",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Category label */}
      {!search.trim() && (
        <p
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.65rem",
            color: "rgba(92,61,46,0.5)",
            margin: "0.3rem 0.6rem 0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {EMOJI_CATEGORIES[activeCategory]?.label}
        </p>
      )}

      {/* Emoji grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: "1px",
          padding: "0.4rem 0.5rem",
          overflowY: "auto",
          flex: 1,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(212,168,83,0.3) transparent",
        }}
      >
        {currentEmojis.map((entry, idx) => (
          <button
            key={`${entry.char}-${idx}`}
            type="button"
            onClick={() => {
              onSelect(entry.char);
              onClose();
            }}
            data-ocid="emoji_picker.button"
            title={entry.name}
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 6,
              background: "transparent",
              cursor: "pointer",
              padding: 2,
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(212,168,83,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            <img
              src={notoEmojiUrl(entry.char)}
              alt={entry.char}
              width={24}
              height={24}
              loading="lazy"
              style={{ imageRendering: "auto", display: "block" }}
              onError={(e) => {
                // Fallback: hide img and show text emoji
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = "none";
                const span = document.createElement("span");
                span.style.fontSize = "1.2rem";
                span.textContent = entry.char;
                img.parentElement?.appendChild(span);
              }}
            />
          </button>
        ))}
        {currentEmojis.length === 0 && (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "1rem",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.78rem",
              color: "rgba(92,61,46,0.45)",
              fontStyle: "italic",
            }}
          >
            No emojis found
          </p>
        )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        data-ocid="emoji_picker.close_button"
        style={{
          margin: "0 0.5rem 0.5rem",
          padding: "0.25rem",
          background: "transparent",
          border: "1px solid rgba(139,111,71,0.2)",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "0.7rem",
          color: "rgba(92,61,46,0.45)",
          fontFamily: "'Lora', Georgia, serif",
        }}
      >
        Close
      </button>
    </div>
  );
}
