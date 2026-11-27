// Graph databases: the idea and the words inside its drawings.
export default {
  ideas: {
    "graph-databases": { title: "Cơ\u00a0sở\u00a0dữ\u00a0liệu đồ\u00a0thị", gist: "Lưu mỗi đối tượng thành một chấm, mỗi mối liên hệ thành một đường nối, rồi tìm câu trả lời bằng cách lần theo các đường nối.", panels: [
      ["Cơ sở dữ liệu của những mối liên hệ", "Nhiều cơ sở dữ liệu lưu thông tin thành bảng, giống một bảng tính. Cơ sở dữ liệu đồ thị (graph database) thì lưu mỗi đối tượng thành một chấm và mối liên hệ giữa chúng thành một đường nối, nên chuyện ai liên quan tới ai nằm sẵn trong dữ liệu. “Đồ thị” ở đây là một mạng lưới, không phải biểu đồ. Neo4j là một ví dụ nổi tiếng."],
      ["Mỗi chấm là một nút", "Mỗi chấm là một nút (node): một đối tượng, chẳng hạn Tom Hanks hay bộ phim Toy Story. Nhãn (label) cho biết đối tượng đó thuộc loại gì, như Person (người) hay Movie (phim). Một nút có thể mang nhiều nhãn: Tom Hanks vừa là Person vừa là Actor (diễn viên)."],
      ["Đường nối là quan hệ", "Quan hệ (relationship) nối hai nút với nhau. Mỗi quan hệ có một kiểu, viết in hoa, và chỉ theo một chiều, nên đọc lên như một câu: Tom Hanks ACTED_IN (đóng trong) Toy Story. Bạn vẫn có thể đi ngược lại, từ bộ phim tìm ra dàn diễn viên."],
      ["Thông tin nằm trên cả chấm lẫn đường nối", "Cả nút lẫn quan hệ đều chứa được thông tin chi tiết, lưu thành từng cặp tên và giá trị, gọi là thuộc tính (property): Tom Hanks sinh năm 1956, Toy Story ra mắt năm 1995. Còn vai Woody thì nằm trên đường nối, vì nó thuộc về mối liên hệ, chứ không riêng của diễn viên hay bộ phim."],
      ["Sao không dùng bảng cho xong?", "Cơ sở dữ liệu dạng bảng để diễn viên, phim và chuyện ai đóng phim nào ở các bảng riêng, rồi ghép lại với nhau qua số ID. Mỗi lần đi xa thêm một bước, như tìm bạn diễn của bạn diễn, lại thêm một lượt ghép. Đồ thị lưu sẵn mối liên hệ ngay tại các nút, nên chỉ việc lần theo đường nối."],
      ["Hỏi bằng cách phác ra hình mẫu", "Muốn hỏi, bạn dùng chữ để vẽ ra hình dạng cần tìm. Ngoặc tròn là nút, mũi tên là quan hệ: (p:Person)-[:ACTED_IN]->(m:Movie). Cơ sở dữ liệu sẽ tìm mọi chỗ trong đồ thị khớp với hình đó, ở đây là tất cả những ai đóng Toy Story. Ngôn ngữ truy vấn này có tên là Cypher."],
      ["Đi xa nhiều bước", "Từ Tim Allen, cơ sở dữ liệu có thể lần theo đường nối tới các phim Tim Allen từng đóng, rồi tới dàn diễn viên của các phim đó, rồi tới những phim khác của họ, cứ thế lan ra từng vòng. Trong hình mẫu, bạn chỉ cần ghi số bước, như *1..4 là từ một đến bốn bước. Với bảng, mỗi vòng lại là một lượt ghép nữa."],
      ["Sáu bước tới Kevin Bacon", "Có một trò chơi vui: nối bất kỳ diễn viên nào với Kevin Bacon qua những bộ phim họ đóng chung. Hỏi đồ thị đường đi ngắn nhất (shortest path), nó sẽ tìm ra lối đi ít bước nhất giữa hai nút: Tim Allen đóng Toy Story cùng Tom Hanks, và Tom Hanks đóng Apollo 13 cùng Kevin Bacon. Ứng dụng chỉ đường hay mạng xã hội cũng giải những bài toán kiểu này."],
      ["“Ai thích phim này cũng thích…”", "Gợi ý phim chỉ là một quãng đi ngắn: từ bạn tới bộ phim bạn chấm điểm cao, quay về những người khác cũng chấm cao phim đó, rồi tới những phim khác họ thích. Chỉ cần viết một hình mẫu, và cơ sở dữ liệu chỉ đi qua các đường nối quanh bạn, chứ không lục hết mọi bộ phim đang lưu."],
      ["Thêm dữ liệu mà không tạo bản trùng", "CREATE luôn thêm một nút mới, kể cả khi nút y hệt đã có sẵn: chạy hai lần là có hai Toy Story. MERGE thì tìm trước và chỉ thêm phần còn thiếu, nên chạy lại cũng không thay đổi gì. Khi không chắc trong đồ thị đã có những gì, hãy dùng MERGE."],
      ["Tìm điểm xuất phát thật nhanh", "Lần theo đường nối thì nhanh, nhưng trước hết cơ sở dữ liệu phải tìm ra chỗ bắt đầu, chẳng hạn nút Tom Hanks. Nếu không có gì hỗ trợ, nó phải xét từng nút một, như đọc hết cả cuốn sách để tìm một cái tên. Chỉ mục (index) giống phần tra cứu ở cuối sách, giúp nhảy thẳng tới đúng chỗ."],
      ["Khi nào nên chọn đồ thị", "Hãy chọn đồ thị khi câu hỏi xoay quanh các mối liên hệ: ai quen ai, cái gì nối với cái gì, đi từ A tới B thế nào. Các đội chống gian lận dùng nó để phát hiện những nhóm tài khoản dùng chung một số điện thoại và một địa chỉ. Còn nếu chủ yếu là cộng dồn các cột, như doanh số từng tháng, thì cơ sở dữ liệu dạng bảng đơn giản hơn."],
    ], links: {
      intro: "Cơ sở dữ liệu đồ thị là gì: nút, quan hệ và thuộc tính, kèm thêm ví dụ (tiếng Anh)",
      cheat: "Toàn bộ ngôn ngữ truy vấn Cypher trên một trang, kèm ví dụ ngắn (tiếng Anh)",
      manual: "Cypher hoạt động thế nào, từ hình mẫu đơn giản tới đường đi (tiếng Anh)",
      wiki: "Cơ sở dữ liệu đồ thị khác cơ sở dữ liệu dạng bảng ra sao, và ra đời thế nào (tiếng Anh)",
    }},
  },

  /* words inside the drawings (draw.js) */
  art: {
    graph: {
      intro: "đối tượng là chấm, liên hệ là đường nối",
      genre: "Hoạt\nhình", labelCap: "nhãn cho biết đó là loại gì",
      type: "kiểu", dir: "chiều", sentence: "“Tom Hanks đóng trong Toy Story”", reads: "đọc lên như một câu",
      props: "thông tin nằm trên cả chấm lẫn đường nối",
      people: "diễn viên", films: "phim", cast: "ai đóng phim nào", match: "bước nào cũng ghép ID", follow: "cứ lần theo đường nối",
      found: "tìm được:", fits: "mọi chỗ khớp với hình mẫu",
      rings: "mỗi bước lan thêm một vòng",
      fewest: "ít bước nhất giữa hai chấm",
      you: "bạn", other: "Lan", suggest: "gợi ý?", walk: "chỉ đi quanh bạn, không lục mọi bộ phim",
      twice: "chạy 2 lần", dup: "thành hai bản", always: "luôn thêm mới", one: "vẫn chỉ một", ifMissing: "thiếu mới thêm",
      idx: "chỉ mục", scan: "xét từng nút một", scanSub: "như đọc hết cả cuốn sách", jump: "nhảy thẳng tới nơi", jumpSub: "như phần tra cứu cuối sách",
      phone: "số ĐT", addr: "địa chỉ", graphQ: "liên hệ? dùng đồ thị", graphSub: "ai dùng chung cái gì", tableQ: "tính tổng? dùng bảng", tableSub: "cộng dồn một cột",
      months: ["T1", "T2", "T3"], total: "tổng",
    },
  },
};
