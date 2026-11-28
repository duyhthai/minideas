// Clean code and refactoring: the idea and the words inside its drawings.
export default {
  ideas: {
    "clean-code-refactoring": { title: "Code sạch và tái\u00a0cấu\u00a0trúc", gist: "Viết code dễ đọc rồi dọn dẹp ngay, để lần sửa sau cũng dễ dàng.", panels: [
      ["Code được đọc nhiều hơn được viết", "Một dòng code chỉ viết một lần nhưng được đọc đi đọc lại: đồng đội đọc, người review code đọc, và chính bạn sáu tháng sau cũng đọc. Code sạch là code mà người đọc sau hiểu được ngay."],
      ["Có đáng không? Code lộn xộn làm bạn chậm lại", "Với code lộn xộn, mỗi tính năng mới lại tốn thời gian hơn tính năng trước. Code được giữ gọn gàng tốn thêm chút công lúc đầu, nhưng về sau vẫn sửa nhanh."],
      ["Viết cho chạy, rồi viết cho gọn", "Trước hết, làm cho code chạy được. Rồi ngay lúc còn nhớ rõ, dọn lại cho gọn mà không thay đổi những gì nó làm: cùng một đầu vào vẫn cho cùng một kết quả. Đó chính là tái cấu trúc (refactoring), và việc này chỉ mất vài phút, chứ không phải một dự án riêng làm sau vài tháng."],
      ["Đặt tên nói rõ ý nghĩa", "Một biến tên d bắt ai đọc cũng phải đoán, còn daysUntilDue thì không. Tên tốt thường khiến chú thích trở nên thừa. Khi cần chú thích, hãy giải thích vì sao code làm vậy, đừng kể lại nó làm gì."],
      ["Mỗi phần chỉ làm một việc", "Một hàm khổng lồ vừa kiểm tra đơn hàng, vừa thanh toán, vừa gửi hóa đơn thì khó theo dõi và động vào là dễ hỏng. Hãy tách thành các phần nhỏ, mỗi phần làm một việc và được đặt tên theo việc đó, như các bước trong một công thức nấu ăn."],
      ["Chỉ viết một lần", "Nếu cùng một đoạn logic bị chép ra ba chỗ, sửa lỗi ở chỗ này thì hai chỗ kia vẫn còn lỗi. Hãy đặt nó ở một nơi rồi dùng lại ở mọi chỗ, theo nguyên tắc DRY (don’t repeat yourself, đừng lặp lại chính mình). Chỉ gộp những thứ cùng ý nghĩa, đừng gộp những thứ chỉ trông giống nhau."],
      ["Cần đến đâu, làm đến đó", "Thêm tùy chọn “phòng khi cần” khiến code phình to, ai đọc cũng phải lội qua, dù phần lớn chẳng bao giờ được dùng. Hãy làm vừa đủ cho nhu cầu hôm nay, khi nào thật sự cần thì thêm. Nguyên tắc này có tên là YAGNI (you aren’t gonna need it, rồi bạn sẽ không cần đến đâu)."],
      ["Dọn từng bước nhỏ, có kiểm thử đi kèm", "Đổi tên một thứ, hoặc tách một đoạn ra thành hàm riêng, rồi chạy bộ kiểm thử tự động. Nếu đạt, lưu lại và làm bước tiếp theo. Nếu có gì hỏng, chỉ cần hoàn tác đúng bước đó. Nhiều bước nhỏ an toàn hơn một bước nhảy lớn."],
      ["Khi AI viết code", "Trợ lý AI có thể viết code trong vài giây, nhưng vẫn cần một người đọc, hiểu và chịu trách nhiệm về nó. AI cũng bắt chước phong cách của phần code xung quanh: code sẵn có gọn gàng thì nó viết gọn gàng, code đã rối thì nó viết càng rối thêm. Hãy bảo nó viết cho chạy rồi viết cho gọn, từng bước nhỏ có kiểm thử, như khi bạn tự viết."],
      ["Mỗi lần ghé qua, dọn một chút", "Chẳng ai viết được bản nháp đầu tiên hoàn hảo, nên code sạch là một thói quen chứ không phải vạch đích. Mỗi lần động vào code cũ, hãy sửa một chỗ nhỏ. Giống như sửa nhà từng phòng một trong khi vẫn ở, chẳng cần đập đi viết lại từ đầu."],
    ], links: {
      guru: "Code sạch trông như thế nào, và tái cấu trúc giúp bạn đạt được điều đó ra sao (tiếng Anh)",
      catalog: "Danh sách các phép tái cấu trúc của Martin Fowler, kèm ví dụ (tiếng Anh)",
      stamina: "Giả thuyết “sức bền thiết kế”: vì sao code gọn gàng có lợi về lâu dài (tiếng Anh)",
      yagni: "YAGNI: vì sao làm sẵn tính năng chưa cần lại tốn kém hơn ta tưởng (tiếng Anh)",
    }},
  },

  /* words inside the drawings (draw.js) */
  art: {
    clean: {
      once: "viết một lần", many: "đọc đi đọc lại", later: "thường là chính bạn sau này",
      x: "thời gian →", y: "thời gian để thêm một tính năng", messy: "code lộn xộn", tidy: "giữ gọn gàng", payoff: "bắt đầu có lời",
      input: "đầu vào", before: "1. cho chạy được", after: "2. dọn cho gọn", same: "cùng\nkết quả",
      bad: "d = 7", good: "daysUntilDue = 7", guess: "d là gì?", clear: "đọc là hiểu",
      comment: "// bỏ qua Chủ nhật: ngân hàng nghỉ", why: "chú thích nói vì sao, không kể làm gì",
      giant: "một hàm khổng lồ", steps: ["kiểm tra đơn", "thanh toán", "gửi hóa đơn"], small: "mỗi phần một việc",
      copied: "chép ra 3 chỗ", missed: "sửa một, sót hai", oneHome: "một phần dùng chung", fixedAll: "sửa một chỗ, đúng mọi nơi",
      justInCase: "phòng khi cần", carry: "ai đọc cũng phải gánh", now: "vừa đủ hôm nay", later2: "cần thì thêm sau",
      change: "thay đổi nhỏ", run: "chạy kiểm thử", pass: "đạt", fail: "lỗi", save: "lưu lại", undo: "hoàn tác", caption: "lặp lại nhiều lần mỗi ngày",
      fast: "viết xong\ntrong vài giây", you: "vẫn do bạn đọc\nvà kiểm tra",
      visits: ["lần 1", "lần 2", "lần 3", "lần 4"], habit: "mỗi lần ghé qua, sửa một chỗ nhỏ", noRewrite: "không cần đập đi làm lại",
    },
  },
};
