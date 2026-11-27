// Steal Like an Artist: the review as a swipeable card stack, one panel per idea, each condensed from the reviewer's
// own text in full.js (no new opinions). The last panel leads to the full review.
// panels: [drawing, ...args] from draw.js, or ["photo", file] for one of the reviewer's photos.
import full from "./full.js";

export default {
  slug: "steal-like-an-artist",
  author: full.author,
  source: full.source,
  date: full.date,
  added: "2026-11-19", // went on Minideas (date is when the review appeared on Sâu Sách)
  related: "outliers",
  full,
  cover: full.cover,
  panels: [["slaMashup"], ["photo", "good-vs-bad-theft.jpg"], ["slaDesks"], ["slaHobbies"], ["slaRoom"], ["slaBoring"], ["slaSubtract"]],
  vi: {
    title: full.vi.title,
    abstract: "Chẳng có gì là nguyên gốc: mọi ý tưởng đều pha trộn từ những ý tưởng trước đó. Thế nào là “good steal”, vì sao nên có hai bàn làm việc analog và digital, và vì sao nên nhàm chán một cách chủ động.",
    panels: [
      ["Chẳng có gì là nguyên gốc", "Tại sao lại “steal”, sao không tự nghĩ ra mà lại “ăn cắp” ý tưởng của người khác? Câu trả lời ở ngay mở đầu sách: chẳng có gì là nguyên gốc, mọi ý tưởng đều là sự pha trộn hay chế biến lại từ những ý tưởng trước đó. Bạn là tổng hòa những ảnh hưởng mà bạn chọn đưa vào cuộc sống của mình."],
      ["Good steal là lấy cảm hứng", "Nếu thấy khó chấp nhận từ “steal” thì gọi là “lấy cảm hứng” sẽ hoa mỹ và dễ chịu hơn. Bảng so sánh của tác giả giải thích rõ hơn, nhưng tất nhiên chỉ “good steal” mới nên gọi là “lấy cảm hứng”."],
      ["Bàn analog, bàn digital", "Máy tính hiệu quả để thực thi và biên tập ý tưởng, nhưng không thích hợp để phát sinh ý tưởng; có những lúc dùng công cụ analog như giấy, viết sẽ hiệu quả và thú vị hơn. Austin Kleon có hai bàn làm việc: analog để bắt đầu, digital để biên tập và xuất bản."],
      ["Dự án riêng và sở thích", "Nếu bạn thích nhiều thứ khác nhau, hãy cứ dành thời gian cho chúng, “để chúng tương tác với nhau”. Một sở thích là thứ sáng tạo chỉ dành riêng cho bạn: không để kiếm tiền hay nổi tiếng, đơn giản chỉ vì nó làm bạn hạnh phúc."],
      ["Tìm một căn phòng khác", "Nếu bạn là người giỏi nhất phòng, hãy tìm một căn phòng khác. Bạn sẽ chỉ giỏi như những người bạn chọn ở bên cạnh, nên hãy “follow” những người tài năng nhất và chú ý họ nói gì, làm gì, kết nối với những gì."],
      ["Nhàm chán một cách chủ động", "Sáng tạo khá tốn năng lượng, nên khó đạt được nếu cứ lãng phí cho những việc vô bổ. Người sáng tạo cần thời gian rỗi; tác giả có vài ý tưởng hay nhất khi thấy chán, và luôn mang theo một cuốn sách, một cây viết, một quyển sổ."],
      ["Sáng tạo là biết bỏ bớt", "Ở thời thông tin quá tải, người vượt lên trước là người biết bỏ bớt để tập trung vào điều thật sự quan trọng. Và lời kết của chính tác giả: có thể có những lời khuyên tệ, cứ lấy điều bạn dùng được và bỏ đi những thứ khác. Chẳng có luật lệ gì cả."],
    ],
    labels: full.vi.labels,
    captions: full.vi.captions,
  },
  en: {
    title: full.en.title,
    abstract: "Nothing is original: every idea is a mix of earlier ones. What a “good steal” is, why to keep an analog desk and a digital desk, and why to be boring on purpose.",
    panels: [
      ["Nothing is original", "Why “steal”? Why take other people’s ideas instead of coming up with your own? The answer is right at the start of the book: nothing is original, every idea is a mix or a reworking of earlier ideas. You are the sum of the influences you choose to let into your life."],
      ["A good steal is inspiration", "If the word “steal” is hard to accept, calling it “taking inspiration” sounds nicer and more comfortable. The author’s comparison chart explains it better, but of course only a “good steal” deserves to be called “taking inspiration”."],
      ["An analog desk, a digital desk", "Computers are great for executing and editing ideas, but not suited to generating them; sometimes analog tools like paper and pens are more effective and more fun. Austin Kleon has two desks: analog to start, digital to edit and publish."],
      ["Side projects and hobbies", "If you love different things, keep spending time on them, “let them talk to each other”. A hobby is something creative that’s just for you: not to make money or get famous, simply because it makes you happy."],
      ["Find another room", "If you’re the best in the room, find another room. You’re only as good as the people you choose to be around, so “follow” the most talented people and pay attention to what they say, what they do, what they link to."],
      ["Boring on purpose", "Being creative takes a lot of energy, so it’s hard to get there if you keep wasting it on pointless things. Creative people need time to do nothing; the author gets some of his best ideas when he’s bored, and always carries a book, a pen and a notebook."],
      ["Creativity is leaving things out", "In an age of information overload, those who get ahead know what to leave out, so they can focus on what really matters. And the author’s own closing words: some advice may be bad, so take what you can use and leave the rest. There are no rules."],
    ],
    labels: full.en.labels,
    captions: full.en.captions,
  },
};
