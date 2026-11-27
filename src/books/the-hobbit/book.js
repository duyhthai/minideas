// The Hobbit: the review as a swipeable card stack, one panel per idea, each condensed from the reviewer's own
// text in full.js (no new opinions). The last panel leads to the full review.
// panels: [drawing, ...args] from draw.js, or ["photo", file] for one of the reviewer's photos.
import full from "./full.js";

export default {
  slug: "the-hobbit",
  author: full.author,
  source: full.source,
  date: full.date,
  full,
  cover: full.cover,
  panels: [["hbWorld"], ["photo", "bag-end-hall.jpg"], ["hbGolf"], ["photo", "misty-mountains-west.jpg"], ["hbJourney"], ["hbWits"], ["hbNotInBook"]],
  vi: {
    title: "The Hobbit",
    abstract: "Ngòi bút lão luyện, sự dí dỏm, và cả những bức tranh do chính Tolkien vẽ.",
    panels: [
      ["Cả một thế giới trong câu chữ", "Tolkien, nhà văn, giáo sư, nhà ngôn ngữ học, đã xây dựng và kết nối các tác phẩm thành thế giới Middle Earth vĩ đại. Câu văn, lời thoại, cách dùng từ, cách đặt tên nhân vật đều rất hay, rất “đẹp”."],
      ["Tolkien còn là họa sĩ", "Bản Enhanced có những bức tranh do chính Tolkien vẽ, ấn tượng và rất riêng. Xem xong, có thể bạn sẽ tự hỏi sao tiểu sử ông không ghi thêm chức danh họa sĩ."],
      ["Môn golf ra đời như thế nào", "Chúa nhẫn là thiên anh hùng ca tăm tối và nghiêm túc; The Hobbit mở đầu nhí nhảnh và hài hước hơn, có lẽ vì ban đầu là sách cho trẻ em. Ngay chương đầu, đầu vua goblin Golfimbul bị gậy gỗ đánh bay xuống hang thỏ: trận đánh thắng, và môn golf ra đời."],
      ["Khi giai điệu cất lên", "Mở đầu có thể chưa quá cuốn hút, nhưng một khi giai điệu “Far over the misty mountains cold” cất lên thì mọi chuyện trở nên hấp dẫn khó cưỡng. Lời tựa của Christopher Tolkien trong bản Enhanced cũng là một phần cộng thêm không nhỏ."],
      ["Kể chậm, kể kỹ", "The Hobbit không vội vàng. Sách kể trọn vẹn hành trình giành lại kho báu của rồng, cả những ngày tháng mệt mỏi, chán nản mà nhân vật phải trải qua, nên cảm xúc của họ hiện ra rõ hơn nhiều."],
      ["Mưu trí và tài ứng biến", "Các nhân vật vượt qua khó khăn bằng sự khéo léo và lanh trí: Gandalf khéo léo thuyết phục được cả Beorn khó tính, Bilbo ứng biến khi gặp nguy, và cả nhóm thoát thân bằng những mẹo quái chiêu."],
      ["Sách hay phim?", "Sách không có Legolas, không có Tauriel (cũng chẳng có nhân vật nữ nào), còn Azog đã chết trận từ lâu. Không cần những thêm thắt ấy, 300 trang sách vẫn kể kỹ hơn ba tập phim về hành trình giành lại kho báu và cảm xúc nhân vật. Đọc sách thì tha hồ tưởng tượng."],
    ],
    labels: {
      world: "thế giới Middle Earth", craft: ["câu văn", "lời thoại", "tên nhân vật"],
      golfimbul: "đầu vua goblin Golfimbul", yards: "bay 100 yard", golf: "môn golf ra đời!", rabbitHole: "hang thỏ",
      journey: "hành trình giành lại kho báu", slow: "kể cả những ngày nhân vật mệt mỏi, chán nản",
      wits: [["Gandalf", "khéo léo"], ["Bilbo", "lanh trí"], ["cả nhóm", "mẹo quái chiêu"]], witsLine: "vượt qua khó khăn bằng mưu trí",
      pages: "300 trang\n→ 3 tập phim", notIn: ["Legolas", "Tauriel", "Azog"], notes: ["dù có mặt cũng hợp lý", "không có nhân vật nữ nào", "đã chết trận từ lâu"],
    },
    captions: full.vi.captions,
  },
  en: {
    title: "The Hobbit",
    abstract: "A masterful pen, a sense of humour, and pictures drawn by Tolkien himself.",
    panels: [
      ["A whole world in words", "Tolkien, a writer, professor and linguist, built his books and linked them into the vast world of Middle Earth. The sentences, dialogue, word choices and character names are all wonderful and “beautiful”."],
      ["Tolkien the artist", "The Enhanced edition includes pictures Tolkien drew himself, striking and distinctive. You may wonder why his biography doesn’t also call him an artist."],
      ["How golf was invented", "The Lord of the Rings is a dark, serious epic; The Hobbit starts out playful and funnier, perhaps because it began as a children’s book. In the first chapter, the goblin king Golfimbul’s head is knocked off with a wooden club and lands in a rabbit hole: the battle is won, and golf is invented."],
      ["When the song starts", "The opening may not grab you, but once the melody of “Far over the misty mountains cold” starts up, it becomes irresistibly compelling. Christopher Tolkien’s foreword in the Enhanced edition is no small bonus either."],
      ["A story that takes its time", "The Hobbit never rushes. It tells the whole quest for the dragon’s treasure, including the weary, miserable days the characters live through, so their feelings come through far more clearly."],
      ["Quick wits", "The characters get through on cleverness and quick thinking: Gandalf cleverly talks round even the gruff Beorn, Bilbo improvises when danger strikes, and the company escapes by outlandish tricks."],
      ["Book or film?", "The book has no Legolas, no Tauriel (no female characters at all), and Azog died in battle long before. Without those additions, its 300 pages tell the quest for the treasure, and how the characters feel, more fully than three films. And a book leaves you free to imagine."],
    ],
    labels: {
      world: "Middle Earth", craft: ["sentences", "dialogue", "character names"],
      golfimbul: "King Golfimbul’s head", yards: "100 yards", golf: "golf is invented!", rabbitHole: "rabbit hole",
      journey: "the quest for the dragon’s treasure", slow: "even the days the characters feel low",
      wits: [["Gandalf", "tact"], ["Bilbo", "quick thinking"], ["the company", "outlandish tricks"]], witsLine: "getting through on their wits",
      pages: "300 pages\n→ 3 films", notIn: ["Legolas", "Tauriel", "Azog"], notes: ["though he’d fit", "no women at all", "long dead"],
    },
    captions: full.en.captions,
  },
};
