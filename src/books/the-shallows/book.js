// The Shallows: the review as a swipeable card stack, one panel per idea, each condensed from the reviewer's own
// text in full.js (no new opinions). The last panel leads to the full review.
// panels: [drawing, ...args] from draw.js, or ["photo", file] for one of the reviewer's photos.
import full from "./full.js";

export default {
  slug: "the-shallows",
  author: full.author,
  source: full.source,
  date: full.date,
  added: "2026-11-19", // went on Minideas (date is when the review appeared on Sâu Sách)
  related: "ai-fundamentals",
  full,
  cover: full.cover,
  panels: [["shlCraving"], ["shlBrainBook"], ["shlRewire"], ["shlNoSpaces"], ["shlPaperKindle"], ["shlInterrupt"], ["shlBalance"], ["shlParadox"]],
  vi: {
    title: full.vi.title,
    abstract: "Không chỉ là mặt trái của Internet: những nghiên cứu về não bộ, lịch sử chữ viết và giấy, và vì sao một bộ não quen với Internet dần khó tập trung sâu.",
    panels: [
      ["Bộ não luôn đòi cái mới", "Lang thang trên mạng, nhảy từ link này sang link khác, tin tức, Facebook, email... Một bộ não quen với Internet luôn muốn nhận được thứ gì đó mới, nhanh chóng, liên tục, và dần khó tập trung sâu vào sách hay những bài viết dài. Ta khao khát cái mới ngay cả khi biết rằng “cái mới bình thường, chứ không cần thiết”."],
      ["Thực ra là sách về não bộ", "Không chỉ nói về mặt trái của công nghệ, The Shallows còn đi xa hơn với những nghiên cứu về não bộ, lịch sử hình thành chữ viết và giấy, những phân tích về các loại công nghệ. Amazon xếp nó vào mục Neuroscience và Neuropsychology, còn NXB Trẻ đưa nó vào bộ Khoa Học Khám Phá."],
      ["Thói quen định hình lại bộ não", "Sách giới thiệu cách trí nhớ ngắn hạn và dài hạn hoạt động, những tăng trưởng và biến đổi não bộ của một nghệ sĩ violin, một người mù, hay khi ta lướt web, đọc sách. Và khi não được hình thành từ những thói quen xấu, “không ai nói được trạng thái mới của não là trạng thái trông đợi”."],
      ["Khoảng cách giữa các từ cũng là phát minh", "Chữ viết từng có đủ loại phương tiện, từ đất sét, giấy cuộn, giấy cói, da thuộc, bảng sáp... rồi mới đến sách. Ban đầu chữđượcviếtliêntục, mô phỏng theo cách nói; khoảng cách giữa các từ chỉ được “phát minh” sau đó, và giúp việc đọc dễ hơn nhiều."],
      ["Sách giấy hay Kindle? Cả hai", "Tác giả chỉ ra thế mạnh của sách giấy: dễ đọc, không sợ rơi vỡ, hư hỏng, hết pin. Là người dùng Kindle lâu năm, mình thấy máy đọc sách cũng có mặt mạnh riêng: E-Ink dễ đọc, pin dùng rất lâu, dễ mua sách nước ngoài, tra từ, mang theo được nhiều sách. Theo quan điểm cá nhân, hay nhất là kết hợp cả hai."],
      ["Hệ sinh thái của sự gián đoạn", "Sau những “bài học lịch sử”, sách đưa ta trở lại thời hiện đại với máy tính và Internet. Như Cory Doctorow viết, mỗi khi bật máy tính lên, chúng ta lại lao vào một “hệ sinh thái các công nghệ gián đoạn”."],
      ["Cuối cùng vẫn là chuyện cân bằng", "Công nghệ không chỉ mang lại tiêu cực: lướt web dùng nhiều chức năng của não nên có thể giúp người lớn tuổi minh mẫn hơn, chơi game giúp tăng tốc độ chuyển tập trung thị giác. Nên cuối cùng, mỗi người chúng ta lại nên quay về vấn đề cơ bản: cân bằng thời gian cho các hoạt động và công việc của mình."],
      ["Người cần đọc nhất lại khó đọc nhất", "Một nghịch lý là cuốn sách hơi mang tính hàn lâm, nên lại khó tiếp cận với chính những người nên đọc nó. Nếu bạn là người “dễ bị sao nhãng”, có lẽ nên bắt đầu với một cuốn sách đơn giản hơn. Dù sao đó cũng là một bước không tệ để làm trí tuệ “thật” hơn."],
    ],
    labels: {
      ...full.vi.labels,
      feeds: ["tin tức", "Facebook", "email", "link"], newFast: "mới, nhanh, liên tục", cantFocus: "khó tập trung sâu",
      strands: ["nghiên cứu\nnão bộ", "lịch sử chữ viết\nvà giấy", "phân tích\ncông nghệ"], amazon: "Amazon: Neuroscience, Neuropsychology", series: "NXB Trẻ: bộ Khoa Học Khám Phá",
      who: ["nghệ sĩ violin", "người mù", "lướt web", "đọc sách"], newState: "không ai nói được trạng thái mới của não\nlà trạng thái trông đợi",
      media: ["đất sét", "giấy cuộn", "da thuộc", "bảng sáp", "sách"], joined: "chữđượcviếtliêntục", spaced: "chữ được viết liên tục", invented: "khoảng cách được “phát minh”", easier: "việc đọc dễ hơn nhiều",
      paper: "sách giấy", reader: "máy đọc sách", paperPros: ["dễ đọc", "không sợ rơi vỡ", "không lo hết pin"], readerPros: ["E-Ink dễ đọc, pin lâu", "dễ mua sách nước ngoài", "tra từ", "mang theo nhiều sách"], both: "hay nhất là kết hợp cả hai",
      ecosystem: "“hệ sinh thái các công nghệ gián đoạn”",
      upsides: ["lướt web: người lớn tuổi minh mẫn hơn", "chơi game: chuyển tập trung thị giác nhanh hơn"], screens: "Internet, game", rest: "hoạt động,\ncông việc khác", balance: "cân bằng thời gian",
      distracted: "dễ bị\nsao nhãng", simpler: "sách đơn giản hơn", academic: "hàn lâm,\nkhó tiếp cận", step: "một bước để trí tuệ “thật” hơn",
    },
    captions: full.vi.captions,
  },
  en: {
    title: full.en.title,
    abstract: "More than the downsides of the Internet: research on the brain, the history of writing and paper, and why a brain used to the Internet finds it ever harder to focus deeply.",
    panels: [
      ["A brain that always wants something new", "Wandering online, jumping from one link to the next, news, Facebook, email... A brain used to the Internet always wants to get something new, quickly, constantly, and gradually finds it hard to focus deeply on books or long articles. We crave the new even when we know that “the new is ordinary, not essential”."],
      ["Really a book about the brain", "It isn’t only about the downsides of technology: The Shallows goes further, with research on the brain, the history of how writing and paper came about, and analyses of different kinds of technology. Amazon lists it under Neuroscience and Neuropsychology, and NXB Trẻ put it in its Science Discovery series."],
      ["Habits reshape the brain", "The book explains how short-term and long-term memory work, and how the brain grows and changes in a violinist, in a blind person, or when we browse the web or read a book. And when the brain has been formed by bad habits, “no one can say that its new state is a desirable one”."],
      ["Even spaces between words were invented", "Writing has lived on all kinds of media, from clay, scrolls, papyrus, parchment, wax tablets... and only then books. At first wordswerewrittenwithoutspaces, imitating the way we speak; spaces were only “invented” later, and made reading much easier."],
      ["Paper or Kindle? Both", "The author points out the strengths of paper books: easy to read, and no fear of breaking, damage or a dead battery. As a long-time Kindle user, I find e-readers have strengths of their own: easy-to-read E-Ink, a battery that lasts ages, easy to buy books from abroad and look up words, lots of books to carry with you. In my personal view, the best way is to combine the two."],
      ["An ecosystem of interruptions", "After the “history lessons”, the book brings us back to the present, with computers and the Internet. As Cory Doctorow put it, every time we turn on our computers, we plunge into an “ecosystem of interruption technologies”."],
      ["It comes down to balance", "Technology doesn’t only bring negatives: browsing the web uses many functions of the brain, so it may help older people stay sharper, and playing games speeds up shifting visual focus. So in the end, each of us should come back to the basic question of balancing our time across our activities and our work."],
      ["Hardest for those who need it most", "The paradox: the book is rather academic, which makes it hard going for exactly the people who should read it. If you’re “easily distracted”, maybe start with a simpler book. Either way, it’s not a bad step toward making your intelligence more “real”."],
    ],
    labels: {
      ...full.en.labels,
      feeds: ["news", "Facebook", "email", "link"], newFast: "new, fast, nonstop", cantFocus: "hard to focus deeply",
      strands: ["brain\nresearch", "the history of\nwriting and paper", "technologies,\nanalysed"], amazon: "Amazon: Neuroscience, Neuropsychology", series: "NXB Trẻ: Science Discovery series",
      who: ["violinist", "blind person", "browsing", "reading"], newState: "no one can say the brain’s new state\nis a desirable one",
      media: ["clay", "scrolls", "parchment", "wax\ntablets", "books"], joined: "wordswerewrittenwithoutspaces", spaced: "words were written without spaces", invented: "spaces “invented”", easier: "reading gets much easier",
      paper: "paper books", reader: "e-readers", paperPros: ["easy to read", "nothing to break", "no battery to run out"], readerPros: ["E-Ink, long battery life", "books from abroad", "look up words", "carry lots of books"], both: "the best way: combine the two",
      ecosystem: "“an ecosystem of interruption technologies”",
      upsides: ["browsing: older people stay sharper", "games: faster shifts of visual focus"], screens: "Internet, games", rest: "other activities,\nwork", balance: "balance your time",
      distracted: "easily\ndistracted", simpler: "a simpler book", academic: "academic,\nhard going", step: "a step toward a more “real” intelligence",
    },
    captions: full.en.captions,
  },
};
