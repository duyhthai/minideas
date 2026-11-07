// Outliers: the review as a swipeable card stack, one panel per idea, each condensed from the reviewer's own
// text in outliers-full.js (no new opinions). The last panel leads to the full review.
// panels: [drawing, ...args] from draw.js, or ["photo", file] for one of the reviewer's photos.
import full from "./outliers-full.js";

export default {
  slug: "outliers",
  author: full.author,
  source: full.source,
  full,
  cover: "book.jpg",
  panels: [["outContents"], ["outBirthMonths"], ["outHours"], ["outIQ"], ["outTrades"], ["outEra"], ["outHonor"], ["outPlanes"], ["outMore"]],
  vi: {
    title: full.vi.title,
    abstract: "Thành công không chỉ nhờ tài năng: thời điểm sinh ra, gia đình, văn hóa và 10.000 giờ khổ luyện. Một trong những cuốn sách xuất sắc nhất mình từng đọc.",
    panels: [
      ["Đừng để mục lục đánh lừa", "Lật mục lục, bạn dễ đặt cuốn sách xuống vì những tựa đề khó hiểu. Đừng! Đây là một trong những cuốn sách xuất sắc nhất mình từng đọc, cuốn hút qua từng mẩu chuyện nhỏ."],
      ["Ai đã có, sẽ được cho thêm", "Tuyển thủ khúc côn cầu chuyên nghiệp thường sinh đầu năm. Lớn hơn bạn bè vài tháng, các em được chú ý và phát triển hơn, và lợi thế nhỏ ấy cứ thế lớn dần."],
      ["10.000 giờ luyện tập", "The Beatles diễn 8 tiếng mỗi ngày, 7 ngày mỗi tuần ở Hamburg; Bill Gates, Bill Joy có cơ hội “nghịch” máy tính hiếm ai có thời đó. 10.000 giờ là đòi hỏi bắt buộc để thành chuyên gia đẳng cấp thế giới."],
      ["IQ 195 vẫn chưa đủ", "Christopher Langan có IQ 195 nhưng chẳng mấy thành công. Trên khoảng 120 điểm, IQ không còn tạo ưu thế; ứng xử khôn ngoan với xã hội là kỹ năng phải học, và gia đình đã không cho ông điều kiện học điều đó."],
      ["Gian khổ làm nên người chuyên nghiệp", "Chương về Joe Flom lý giải thành công của người Do Thái: quan trọng nhất không phải văn hóa tri thức, mà là gian khổ, tha hương, phải làm đủ loại ngành nghề."],
      ["Thời thế", "Sinh đầu những năm 1930 là thời điểm thần diệu cho luật gia, 1955 cho lập trình viên, 1835 cho nhà thầu khoán. Nhưng có những thế hệ sinh vào dịch bệnh, chiến tranh, khủng hoảng và chẳng có mấy cơ hội."],
      ["Văn hóa danh dự", "Người chăn gia súc trên đồi núi phải tự xoay xở và luôn sợ mất đàn, nên phải tỏ ra không yếu ớt; người trồng trọt sống nhờ cộng tác. Đó là lý giải cho những vụ bạo lực đầy chất viễn Tây."],
      ["Né tránh hiện thực, máy bay rơi", "Máy bay rơi thường do nhiều sự cố nhỏ tích tụ, và do phi công ngại lên tiếng với “bề trên”. Sau nhiều tai nạn, phi công Hàn Quốc được đào tạo dùng tiếng Anh để thoát khỏi ràng buộc của ngôn ngữ mình."],
      ["Còn nhiều điều hay nữa", "Sự cần cù của văn hóa lúa nước, cách giáo dục của KIPP, hệ quả của kỳ nghỉ hè dài... 99.000đ có lẽ không rẻ cho một cuốn sách nhỏ, nhưng vẫn quá hời cho một cuốn sách tuyệt vời như vậy."],
    ],
    labels: {
      ...full.vi.labels,
      contentsTitle: "MỤC LỤC", cryptic: "tên chương\nkhó hiểu", inside: "bên trong: chuyện nào\ncũng cuốn hút",
      flomCaption: "chương Joe Flom", hardship: "gian khổ,\ntha hương", trades: "đủ loại\nngành nghề", professional: "người\nchuyên nghiệp",
      more: ["văn hóa\nlúa nước", "KIPP", "kỳ nghỉ\nhè dài"], price: "99.000đ: quá hời",
    },
    captions: full.vi.captions,
  },
  en: {
    title: full.en.title,
    abstract: "Success isn’t only talent: when you were born, your family, your culture, and 10,000 hours of practice. One of the best books I’ve ever read.",
    panels: [
      ["Don’t let the contents fool you", "Flip to the table of contents and the cryptic titles might make you put this book down. Don’t! It’s one of the best books I’ve ever read, gripping in every little story."],
      ["To those who have, more is given", "Professional hockey players tend to be born early in the year. A few months older than their peers, they get noticed and developed more, and that small edge keeps growing."],
      ["10,000 hours of practice", "The Beatles played 8 hours a day, 7 days a week in Hamburg; Bill Gates and Bill Joy got rare chances to “play” with computers. 10,000 hours is what it takes to become a world-class expert."],
      ["An IQ of 195 isn’t enough", "Christopher Langan has an IQ of 195 but little success. Above about 120, extra IQ gives no real advantage; social savvy is a skill you have to learn, and his family never gave him the chance."],
      ["Hardship makes professionals", "The Joe Flom chapter explains Jewish success: not mainly an intellectual culture, but hardship, life far from home, and working every kind of trade."],
      ["The times you’re born into", "Being born in the early 1930s was a magical time for lawyers, 1955 for programmers, 1835 for entrepreneurs. But some generations were born into epidemic, war and depression, and never stood much of a chance."],
      ["A culture of honor", "Herders on rocky hills are on their own and always fear losing their animals, so they must show they aren’t weak; farmers survive by cooperating. That explains feuds straight out of the Wild West."],
      ["Avoid reality, and planes crash", "Planes crash when small problems add up, and when pilots are afraid to speak up to those “above” them. After several accidents, Korean pilots were trained to use English to escape the constraints of their own language."],
      ["And much more", "The diligence of rice-farming cultures, KIPP’s approach to schooling, what long summer holidays do... 99,000 VND may not be cheap for a small book, but it’s a bargain for one this wonderful."],
    ],
    labels: {
      ...full.en.labels,
      contentsTitle: "CONTENTS", cryptic: "cryptic chapter\ntitles", inside: "inside: one gripping\nstory after another",
      flomCaption: "the Joe Flom chapter", hardship: "hardship,\nfar from home", trades: "every kind\nof trade", professional: "professionals",
      more: ["rice-farming\ncultures", "KIPP\nschools", "long summer\nholidays"], price: "99,000 VND: a bargain",
    },
    captions: full.en.captions,
  },
};
