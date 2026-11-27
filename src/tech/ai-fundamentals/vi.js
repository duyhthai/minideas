// AI Fundamentals: the collection, its ideas and the words inside its drawings.
export default {
  collections: {
    "ai-fundamentals": {
      title: "Nền tảng AI",
      lede: "Máy tính học như thế nào, chatbot tạo câu trả lời ra sao, và dùng AI thế nào cho đúng.",
      chapters: { big: "AI là gì", learn: "Máy tính học như thế nào", work: "Đưa vào thực tế", gen: "AI tạo sinh", use: "Dùng AI đúng cách" },
      links: {
        coursera: "Khóa Machine Learning Specialization của Andrew Ng",
        kaggle: "Thực hành với dữ liệu thật cùng cộng đồng khoa học dữ liệu",
        dlai: "Các khóa học ngắn về học sâu và AI tạo sinh",
      },
    },
  },

  ideas: {
    "ai-family": { title: "Phân biệt AI, học máy, học sâu", gist: "AI, học máy, học sâu và AI tạo sinh lồng vào nhau như búp bê Nga.", panels: [
      ["Bốn khái niệm lồng vào nhau", "Mọi công cụ AI tạo sinh đều là một dạng học sâu, học sâu là một dạng học máy, và học máy là một dạng AI."],
      ["Trí tuệ nhân tạo (AI)", "Bất kỳ hệ thống máy tính nào làm được việc mà ta gọi là thông minh: chơi cờ, nhận diện khuôn mặt, tìm đường đi. Nó có thể làm theo quy tắc do người viết sẵn, hoặc tự học từ dữ liệu."],
      ["Học máy (machine learning)", "Là AI học từ ví dụ thay vì được dạy quy tắc. Cho nó xem hàng nghìn trường hợp cũ, nó sẽ tự tìm ra quy luật."],
      ["Học sâu (deep learning)", "Là học máy được xây từ nhiều lớp phép tính đơn giản, phỏng theo cách tế bào não hoạt động. Nhờ nó mà máy tính giỏi xử lý ảnh, giọng nói và ngôn ngữ."],
      ["AI tạo sinh (generative AI)", "Là học sâu dùng để tạo ra cái mới: bài viết, hình ảnh, code và âm thanh. Chatbot và công cụ tạo ảnh nằm trong vòng tròn nhỏ nhất này."],
    ]},
    "rules-vs-learning": { title: "Lập trình truyền thống và học máy", gist: "Phần mềm truyền thống làm theo quy tắc do con người viết. Học máy tự tìm ra quy tắc từ ví dụ.", panels: [
      ["Lập trình truyền thống: quy tắc vào, câu trả lời ra", "Lập trình viên viết ra quy tắc. Máy tính áp dụng chúng lên dữ liệu và đưa ra câu trả lời, giống như đầu bếp nấu theo công thức."],
      ["Viết quy tắc thì dễ, cho đến khi gặp ca khó", "Phân biệt đi bộ, chạy bộ và đạp xe bằng quy tắc tốc độ thì dễ. Nhưng tốc độ bao nhiêu thì là chơi golf? Có những việc quá phức tạp để viết thành quy tắc."],
      ["Học máy làm ngược lại", "Đưa cho nó thật nhiều ví dụ kèm đáp án đúng. Nó sẽ tự tìm ra quy tắc."],
      ["Học từ ví dụ có gắn nhãn", "Ghi lại cảm biến chuyển động của điện thoại khi người ta đi bộ, chạy, đạp xe và chơi golf, rồi gắn nhãn cho từng bản ghi. Mô hình sẽ tìm ra quy luật của từng hoạt động, kể cả golf."],
    ]},
    "model-errors": { title: "Làm sao mô hình biết mình sai", gist: "Mô hình đưa ra dự đoán, đo xem lệch bao nhiêu, rồi điều chỉnh để thu hẹp khoảng cách.", panels: [
      ["Bắt đầu từ ví dụ thật", "Mỗi chấm là một căn nhà thật: diện tích ở trục ngang, giá ở trục dọc. Việc của mô hình là đoán giá từ diện tích."],
      ["Mô hình đưa ra phỏng đoán", "Đường màu xanh là giá mà mô hình dự đoán cho mỗi diện tích. Nó không thể đi qua mọi chấm."],
      ["Khoảng cách chính là sai số", "Khoảng cách từ mỗi chấm thật đến đường thẳng cho thấy dự đoán sai bao nhiêu với căn nhà đó."],
      ["Huấn luyện là thu nhỏ sai số", "Huấn luyện là dịch chuyển đường thẳng, hết lần này đến lần khác, cho đến khi tổng sai số nhỏ nhất có thể. Mỗi khoảng cách được bình phương trước để lỗi lớn bị tính nặng hơn. Giới chuyên môn gọi điểm số này là sai số bình phương trung bình (MSE)."],
    ]},
    "overfitting": { title: "Học hiểu hay học vẹt", gist: "Mô hình tốt nắm được xu hướng chung, chứ không học vẹt từng chi tiết của dữ liệu luyện tập.", panels: [
      ["Quá đơn giản: chưa khớp (underfitting)", "Một đường thẳng không thể đi theo một đường cong. Giống như học sinh chỉ học một công thức rồi dùng cho mọi câu hỏi. Giới chuyên môn gọi đây là độ chệch cao (high bias)."],
      ["Học vẹt: quá khớp (overfitting)", "Đường này chạm mọi chấm luyện tập nhưng lại ngoằn ngoèo lung tung. Giống học sinh học thuộc lòng đề ôn tập, vào thi thật thì trượt. Giới chuyên môn gọi đây là phương sai cao (high variance)."],
      ["Vừa khéo: biết khái quát", "Một đường cong mượt đi theo xu hướng thật và bỏ qua nhiễu. Nhờ vậy nó đoán tốt cả với dữ liệu chưa từng thấy."],
      ["Phép thử thật là dữ liệu mới", "Luôn kiểm tra mô hình bằng những ví dụ nó chưa được học. Đường cong mượt vẫn khớp với các chấm vàng mới. Đường ngoằn ngoèo thì trượt."],
    ]},
    "clean-data": { title: "Làm sạch dữ liệu trước", gist: "Dữ liệu tệ thì mô hình cũng tệ: rác vào, rác ra.", panels: [
      ["Dữ liệu thật thường lộn xộn", "Đơn vị lẫn lộn, ô trống và giá trị lạ luôn len vào khi con người thu thập dữ liệu. Mỗi ô đỏ ở đây là một vấn đề."],
      ["Thống nhất đơn vị", "Đưa mọi giá trị về cùng một đơn vị. 1.500 một tháng thành 18.000 một năm, để mô hình so sánh trên cùng một thước đo."],
      ["Xử lý chỗ trống", "Khi thiếu một giá trị, hãy điền một ước lượng hợp lý hoặc đánh dấu là không rõ. Đừng để ô trống lọt qua mà không ai để ý."],
      ["Bỏ những dòng không cứu được", "Một dòng gần như trống thì gây hại nhiều hơn có ích, nên hãy xóa nó. Sau đó kiểm tra các giá trị bất thường: 3.000.000 một năm là thật, hay gõ nhầm?"],
    ]},
    "types-of-learning": { title: "Ba kiểu học máy", gist: "Có đáp án, không có đáp án, hoặc thử và sai.", panels: [
      ["Học có giám sát: học có đáp án", "Mỗi ví dụ đều kèm đáp án đúng. Cho nó xem các email đã được đánh dấu là spam hay không, nó sẽ học cách phân loại email mới."],
      ["Hai loại đáp án", "Phân loại (classification) chọn một nhóm, ví dụ spam hay không spam. Hồi quy (regression) dự đoán một con số, ví dụ giá nhà. Phần tiếp theo cho thấy một mô hình hồi quy học như thế nào."],
      ["Học không giám sát: tự tìm nhóm", "Không có đáp án nào được cho trước. Mô hình tự nhận ra ví dụ nào giống nhau, chẳng hạn những khách hàng có thói quen mua sắm giống nhau. Cách này gọi là phân cụm (clustering)."],
      ["Học tăng cường: thử và sai", "Mô hình thử các hành động và nhận thưởng hoặc phạt, giống như chú chó học làm trò để được thưởng. AI chơi game và robot học theo cách này."],
    ]},
    "ml-lifecycle": { title: "Từ ý tưởng đến mô hình chạy thật", gist: "Xây mô hình là một vòng lặp: thu thập, huấn luyện, kiểm thử, triển khai, giám sát, rồi lặp lại.", panels: [
      ["Một vòng lặp, không phải làm một lần là xong", "Dự án học máy chạy theo chu kỳ. Công việc không dừng lại khi mô hình được đưa vào sử dụng."],
      ["Bắt đầu từ bài toán, rồi đến dữ liệu", "Biến mục tiêu kinh doanh thành một câu hỏi mà mô hình có thể trả lời. Sau đó thu thập, làm sạch dữ liệu và chọn ra những thông tin quan trọng (gọi là đặc trưng, hay features)."],
      ["Huấn luyện và kiểm thử", "Huấn luyện mô hình, rồi kiểm tra nó theo mục tiêu kinh doanh. Nếu chưa đạt, quay lại lấy thêm dữ liệu hoặc dữ liệu tốt hơn rồi thử lại."],
      ["Triển khai và tiếp tục theo dõi", "Khi đã chạy thật, hãy theo dõi hiệu quả của nó. Thế giới luôn thay đổi, nên cần đưa dữ liệu mới vào và huấn luyện lại. Vận hành tốt vòng lặp này gọi là MLOps."],
    ]},
    "neural-networks": { title: "Mạng nơ-ron", gist: "Những lớp phép tính nhỏ chuyền số cho nhau và tự tìm ra các ý trung gian hữu ích.", panels: [
      ["Từng lớp phép tính nhỏ", "Mỗi vòng tròn nhận vào các con số, gán cho mỗi số một trọng số thể hiện mức độ quan trọng, rồi truyền đi một con số duy nhất."],
      ["Đầu vào, lớp ẩn, đầu ra", "Lớp đầu vào nhận dữ kiện thô, các lớp ẩn xử lý chúng, và lớp đầu ra đưa ra câu trả lời. “Sâu” đơn giản là có nhiều lớp ẩn."],
      ["Ví dụ: chiếc áo thun này có bán chạy không?", "Bốn dữ kiện được đưa vào. Lớp giữa biến chúng thành những ý như “giá có hợp lý không?” và “nhiều người biết đến chưa?”. Đầu ra là khả năng chiếc áo trở thành hàng bán chạy."],
      ["Không ai đặt tên cho các ý ở giữa", "Ta không hề bảo mạng phải nghĩ về giá cả. Trong lúc huấn luyện, nó tự tìm ra những ý trung gian giúp đoán đúng. Sức mạnh của nó nằm ở đó."],
      ["Cách nó học: đoán, kiểm tra, chỉnh", "Vẫn là cách làm với đường thẳng giá nhà: mạng đưa ra dự đoán, đo xem lệch bao nhiêu, rồi chỉnh nhẹ mọi trọng số để lần sau đoán tốt hơn. Mạng lớn có hàng tỷ trọng số, nên việc huấn luyện cần rất nhiều dữ liệu và sức mạnh tính toán."],
    ]},
    "next-word": { title: "Chatbot tạo ra câu trả lời thế nào", gist: "Nó đoán từ tiếp theo, thêm vào, rồi lại đoán tiếp.", panels: [
      ["Nó đoán từ tiếp theo", "Đưa cho nó một đoạn văn, nó sẽ chấm điểm mọi từ có thể đứng tiếp theo. Sau “Con mèo nằm trên”, “ghế” được điểm cao còn “mặt trăng” thì rất thấp. Điểm số đó đến từ những quy luật trong mọi thứ nó từng đọc."],
      ["Rồi lặp lại", "Nó thêm từ vừa chọn vào, rồi đoán từ tiếp theo, rồi từ tiếp nữa. Mọi câu trả lời, từ một email đến một bài thơ, đều được ghép từng mảnh một như vậy. (Nói chính xác thì mỗi mảnh thường là một phần của từ, gọi là token.)"],
      ["Mỗi lần chọn có chút may rủi", "Nó không phải lúc nào cũng chọn từ có điểm cao nhất. Một chút ngẫu nhiên giúp câu văn tự nhiên hơn, và đó là lý do cùng một câu hỏi có thể nhận câu trả lời khác nhau mỗi lần."],
      ["Cuộc trò chuyện là một văn bản dài", "Tin nhắn của bạn và câu trả lời của nó được nối thành một văn bản, và nó cứ viết tiếp văn bản đó. Trước mỗi từ mới, nó đọc lại toàn bộ, nhưng chỉ đến một giới hạn nhất định, nên trong những cuộc trò chuyện rất dài nó có thể quên mất phần đầu."],
    ]},
    "foundation-models": { title: "Mô hình nền tảng", gist: "Một mô hình khổng lồ, huấn luyện một lần trên núi dữ liệu, rồi dùng cho rất nhiều việc.", panels: [
      ["Học từ gần như mọi thứ", "Khả năng đoán từ có được nhờ luyện tập với một khối văn bản khổng lồ, thường kèm cả hình ảnh và code. Không cần gắn nhãn: chính từ tiếp theo trong văn bản là đáp án. Trong quá trình đó, nó học được ngữ pháp, kiến thức và cách các ý tưởng liên kết với nhau."],
      ["Rồi đem đi làm đủ loại việc", "Cùng một mô hình có thể viết, tóm tắt, trích xuất thông tin, trò chuyện và trả lời câu hỏi. Bạn không cần một mô hình mới cho mỗi việc."],
      ["Hiếm khi bạn phải tự xây", "Huấn luyện một mô hình tốn cả gia tài, nên chỉ vài công ty lớn làm việc này. Phần lớn mọi người dùng mô hình qua một ứng dụng hoặc dịch vụ trực tuyến. Một số mô hình còn được tải về miễn phí để chạy trên máy của bạn."],
    ]},
    "embeddings": { title: "Từ ngữ như những điểm trên bản đồ", gist: "AI biến từ ngữ thành dãy số, nên những từ có nghĩa gần nhau sẽ nằm gần nhau.", panels: [
      ["Mỗi từ trở thành một dãy số", "Mỗi con số chấm điểm từ đó theo một đặc điểm. “Mèo” có điểm cao ở đặc điểm họ mèo, còn “chó” thì không. Dãy số này gọi là embedding (vector nhúng)."],
      ["Từ giống nhau nằm gần nhau", "Embedding thật có hàng trăm con số. Nén chúng xuống còn hai rồi vẽ lên như một tấm bản đồ: mèo và mèo con nằm cạnh nhau, còn nhà cửa thì ở tít đằng xa."],
      ["Hướng đi cũng mang ý nghĩa", "Bước đi từ “đàn ông” sang “phụ nữ” gần giống bước từ “vua” sang “nữ hoàng”. Nhờ vậy mô hình nắm được mối quan hệ giữa các từ, chứ không chỉ bản thân từng từ."],
      ["Tìm kiếm theo ý nghĩa", "Biến cả tài liệu thành các điểm trên bản đồ, và một câu hỏi sẽ nằm gần những trang có cùng ý nghĩa, dù không chung chữ nào. Đây là cách AI tìm đúng trang trong tài liệu của bạn, và sẽ được dùng lại ở phần “Tùy chỉnh mô hình cho riêng bạn”."],
    ]},
    "customizing-models": { title: "Tùy chỉnh mô hình cho riêng bạn", gist: "Bắt đầu bằng một prompt tốt hơn, rồi đưa tài liệu của bạn vào. Chỉ huấn luyện lại khi thật cần.", panels: [
      ["Bốn cách tùy chỉnh", "Bắt đầu từ bậc dưới cùng. Mỗi bậc lên cao tốn thêm công sức và tiền bạc, nhưng mô hình càng chuyên biệt. Phần lớn nhu cầu chỉ cần hai bậc đầu."],
      ["Viết prompt tốt hơn", "Hướng dẫn rõ ràng kèm vài ví dụ, như ở phần trước. Cách này miễn phí, có kết quả ngay, và thường là đủ."],
      ["Đưa tài liệu của bạn cho mô hình (RAG)", "Trước khi trả lời, hệ thống tìm trong tài liệu của bạn theo ý nghĩa, giống tấm bản đồ từ ngữ, rồi đưa những trang phù hợp nhất cho mô hình. Giống như thi được mở tài liệu: không phải huấn luyện lại, và dễ cập nhật."],
      ["Huấn luyện thêm (fine-tuning)", "Huấn luyện thêm một mô hình có sẵn bằng ví dụ của riêng bạn để nó học giọng văn hoặc một nghiệp vụ chuyên môn. Giống như cử một người mới tốt nghiệp đi học khóa chuyên sâu."],
      ["Xây từ đầu", "Huấn luyện một mô hình hoàn toàn mới trên dữ liệu của bạn. Việc này cần rất nhiều dữ liệu, tiền bạc và chuyên môn, nên rất ít tổ chức cần làm."],
    ]},
    "prompting": { title: "Viết prompt tốt", gist: "Giao việc cho AI như giao cho một đồng nghiệp mới: làm gì, vì sao, với dữ liệu gì, và trả kết quả ra sao.", panels: [
      ["Bốn phần của một prompt rõ ràng", "Nói rõ cần làm gì, vì sao việc đó quan trọng, làm với dữ liệu nào, và câu trả lời trông như thế nào."],
      ["Bản giao việc khi điền đầy đủ", "Đây là ví dụ cho việc kiểm tra tồn kho. Thiếu bất kỳ phần nào, AI sẽ phải đoán."],
      ["Cho xem ví dụ, đừng chỉ dặn", "Chỉ hỏi thẳng gọi là zero-shot. Đưa vài ví dụ mẫu trước (few-shot) giúp AI làm theo đúng định dạng bạn muốn."],
      ["Bảo nó suy nghĩ từng bước", "Với bài toán và câu hỏi logic, hãy yêu cầu nó trình bày từng bước trước khi trả lời. Vì nó viết từng từ một, viết các bước ra trước giúp nó có nền để dựa vào. Cách này gọi là chain-of-thought (chuỗi suy luận)."],
      ["Thêm vài cách để có câu trả lời tốt hơn", "Hỏi vài lần rồi so sánh. Xin vài phương án trước khi chọn một. Dán vào những tài liệu mà nó nên dựa vào. Và nếu ứng dụng cho phép, hãy để nó tra cứu hoặc tính toán thay vì đoán."],
    ]},
    "made-up-answers": { title: "Vì sao AI bịa chuyện", gist: "Nó viết ra điều nghe có vẻ hợp lý, mà hợp lý chưa chắc đã đúng.", panels: [
      ["Tự tin mà sai", "Hỏi về một chi tiết hiếm gặp, chatbot có thể tự bịa ra: một cuốn sách không ai viết, một câu nói không ai nói, một nghiên cứu chưa ai làm. Giọng nó vẫn chắc chắn như khi nói đúng. Hiện tượng này gọi là ảo giác (hallucination)."],
      ["Nó viết tiếp, chứ không tra cứu", "Như ở bài “[Chatbot tạo ra câu trả lời thế nào](next-word)”, nó ghép câu trả lời từng từ một, mỗi lần chọn từ nghe hợp lý nhất. Hỏi về sách, câu trả lời hợp lý có một khuôn quen thuộc: tên sách, tác giả, năm xuất bản. Mỗi mảnh chỉ cần khớp với những từ đứng trước. Không có bước nào kiểm tra xem cuốn sách đó có thật hay không."],
      ["Nghe hợp lý chưa chắc đã đúng", "Với những sự thật nổi tiếng, xuất hiện vô số lần, từ nghe hợp lý nhất cũng chính là từ đúng. Với một chi tiết hiếm, nó chỉ gặp một lần hoặc chưa từng gặp, nên không có quy luật rõ ràng nào để dựa vào, và một phỏng đoán nghe xuôi tai sẽ lấp vào chỗ trống."],
      ["Vì sao nó không nói “tôi không biết”", "Khi huấn luyện và kiểm tra mô hình, câu trả lời thường được chấm như bài thi: đúng thì được điểm, sai hay “tôi không biết” đều không được gì. Như khi thi trắc nghiệm, thà khoanh bừa còn hơn bỏ trống, nên mô hình cũng học cách đoán. Còn giọng chắc chắn thì nó học từ chính những văn bản đã đọc, vốn hiếm khi ngập ngừng, nên một câu đoán nghe cũng chắc như một sự thật."],
      ["Cách tự bảo vệ mình", "Đưa cho nó nguồn tài liệu để dựa vào, giống thi được mở tài liệu ở bài “[Tùy chỉnh mô hình cho riêng bạn](customizing-models)”. Hỏi xem mỗi thông tin lấy từ đâu, và kiểm tra lại những gì quan trọng, nhất là tên, số liệu và trích dẫn, trước khi dùng."],
    ]},
    "responsible-ai": { title: "AI có trách nhiệm", gist: "Bốn câu hỏi cần đặt ra trước khi giao cho AI những quyết định liên quan đến con người.", panels: [
      ["Có công bằng không?", "Một mô hình có thể chính xác nếu xét trung bình mà vẫn đối xử bất công với một số người. Nếu học từ hồ sơ những người từng được tuyển, phần lớn là nam giới, nó có thể học cách chấm ứng viên nữ thấp hơn. Nó sao chép khuôn mẫu trong các ví dụ, kể cả định kiến."],
      ["Có bảo vệ dữ liệu cá nhân không?", "Thông tin cá nhân trong dữ liệu huấn luyện có thể lộ ra trong câu trả lời, và những gì bạn dán vào khung chat có thể bị lưu lại hoặc dùng để huấn luyện. Hãy biết dữ liệu đi đâu trước khi chia sẻ."],
      ["Nó có giải thích được không?", "Nếu một khoản vay bị từ chối, người đó xứng đáng được biết lý do, nhưng nhiều mô hình không nói được. Khi việc hệ trọng, hãy chọn hệ thống có lý do kiểm tra được, và cho mọi người biết khi có AI tham gia."],
      ["Ai là người chịu trách nhiệm?", "Mỗi hệ thống AI cần có người phụ trách: người theo dõi cách nó hoạt động, tiếp nhận khiếu nại, và có thể can thiệp, bác bỏ quyết định của nó. “Máy tính quyết định” không bao giờ là câu trả lời cuối cùng."],
    ]},
  },

  /* words inside the drawings (draw.js) */
  art: {
    family: { ai: "Trí tuệ nhân tạo", ml: "Học máy", dl: "Học sâu", gen: "AI\ntạo sinh" },
    rules: {
      rules: "Quy tắc", data: "Dữ liệu", answers: "Câu trả lời", progBox: "Lập trình\ntruyền thống", mlBox: "Học\nmáy",
      names: ["đi bộ", "chạy bộ", "đạp xe", "chơi golf"], speeds: ["tốc độ < 4", "tốc độ < 12", "nhanh hơn nữa", "không có luật"],
      tags: ["ĐI BỘ", "CHẠY", "ĐẠP XE", "GOLF"], sensor: "dữ liệu cảm biến + đáp án đúng",
    },
    error: { x: "diện tích nhà →", y: "giá", real: "nhà thật", guess: "dự đoán của mô hình", off: "lệch bao nhiêu", mse: "sai số MSE", mseSub: "= trung bình các ô vuông" },
    fit: { under: "quá đơn giản", over: "học vẹt", right: "vừa khéo", test: "phép thử thật", newData: "dữ liệu mới" },
    data: { headers: ["Tuổi", "Thu nhập", "Bang"], sep: ".", yr: "năm", mo: "tháng", unknown: "không rõ", typo: "thật, hay gõ nhầm?" },
    types: {
      spam: "spam", notSpam: "hợp lệ", model: "mô hình", spamQ: "spam?", examples: "ví dụ + đáp án",
      classification: "phân loại", whichGroup: "nhóm nào?", regression: "hồi quy", whatNumber: "số bao nhiêu?",
      unnamed: "không ai đặt tên cho các nhóm này", treat: "+1 phần thưởng", tryFail: "thử, sai, chỉnh, lặp lại",
    },
    loop: { problem: "bài toán", data: "dữ liệu", train: "huấn luyện", test: "kiểm thử", launch: "triển khai", monitor: "giám sát", notYet: "chưa đạt?" },
    net: { input: "đầu vào", hidden: "các lớp ẩn", output: "đầu ra", flow: "các con số đi theo hướng này", guess: "dự đoán", right: "đáp án đúng", nudge: "chỉnh nhẹ mọi trọng số", repeat: "đoán, kiểm tra, chỉnh, lặp lại" },
    demand: {
      inputs: ["giá", "phí ship", "tiếp thị", "chất liệu"], hidden: ["giá hợp lý?", "nhiều người biết?", "chất lượng tốt?"],
      out: "bán chạy?", facts: "4 dữ kiện", ideas: "3 ý", answer: "1 đáp án",
    },
    found: {
      pretrain: "huấn luyện\nban đầu", pile1: "một núi dữ liệu,", pile2: "không cần gắn nhãn", model: "mô hình nền tảng",
      tasks: ["viết", "tóm tắt", "trích xuất thông tin", "trò chuyện", "trả lời câu hỏi", "tạo hình ảnh"],
      online: "dùng qua mạng", onlineSub: "trong ứng dụng, dịch vụ", local: "tự chạy trên máy", localSub: "một số tải về miễn phí",
    },
    gen: {
      start: ["Con", "mèo", "nằm", "trên"], options: ["ghế", "thảm", "sàn nhà", "mặt trăng"], scores: "xác suất của từng từ kế tiếp",
      next: ["ghế", "rồi", "ngủ"], loopCaption: "thêm từ vào, rồi đoán tiếp",
      tries: ["lần 1", "lần 2"], endings: ["… ghế rồi ngủ say.", "… thảm, kêu gừ gừ."], samplingCaption: "cùng câu mở đầu, mỗi lần một kết khác",
      you: "Bạn:", ai: "AI:", readsAll: "trước mỗi\ntừ mới,\nnó đọc lại\ntất cả",
    },
    embed: {
      traits: ["sinh vật", "họ mèo", "con người", "giới tính", "hoàng gia", "động từ", "số nhiều"], dec: ",",
      cat: "mèo", dog: "chó", kitten: "mèo con", houses: "nhà cửa", caption: "mỗi số chấm điểm một đặc điểm", close: "gần nhau = giống nghĩa",
      man: "đàn ông", woman: "phụ nữ", king: "vua", queen: "nữ hoàng", same: "cùng một bước",
      query: "“quên đăng nhập”", near: "Cách đặt lại mật khẩu", far: ["Giờ mở cửa văn phòng", "Chính sách nghỉ phép"], noShared: "không chung chữ nào, vẫn khớp",
    },
    custom: { prompt: "prompt tốt hơn", rag: "tài liệu của bạn (RAG)", fine: "huấn luyện thêm", scratch: "xây\ntừ đầu", effort: "tốn công và chi phí hơn", special: "chuyên biệt hơn" },
    prompt: {
      parts: [["Yêu cầu", "cần làm gì"], ["Bối cảnh", "vì sao, cho ai"], ["Dữ liệu đầu vào", "làm với dữ liệu nào"], ["Định dạng kết quả", "câu trả lời trông như thế nào"]],
      example: [["Yêu cầu", "Đơn hàng nào giao được?"], ["Bối cảnh", "Kiểm tra tồn kho cho shop online"], ["Dữ liệu đầu vào", "Đơn 1: 5×A, 3×B · Kho: A 8, B 4"], ["Định dạng kết quả", "Bảng: đơn hàng, giao hay nhập thêm"]],
      translate: "Dịch sang tiếng Pháp:", cheese: "phô mai →", examples: ["biển → mer", "mèo → chat"], reply: ["Được! Trong tiếng Pháp,", "phô mai là “fromage”…"],
      question: "3 hộp trứng, mỗi hộp 12 quả. 5 quả bị vỡ.\nCòn bao nhiêu quả lành?", think: "“Hãy suy nghĩ từng bước.”", answer: "đáp án: 31",
      tricks: ["hỏi vài lần", "xin vài phương án", "đưa nguồn tài liệu", "cho dùng công cụ"],
    },
    trust: {
      ask: "Có sách nào hay về lịch sử\ncà phê Việt Nam không?", claim: "Bạn thử đọc “Giọt đắng”\ncủa Trần Minh Khang (2014).", stamp: "bịa ra", sure: "nói chắc như đinh đóng cột",
      famous: ["sự thật nổi tiếng", "Thủ đô\ncủa Pháp là", "Paris", "gặp vô số lần"],
      rare: ["chi tiết hiếm gặp", "Sách hay về lịch sử\ncà phê Việt Nam là", "Giọt đắng", "hiếm khi, hoặc chưa từng gặp"],
      shapeTag: "khuôn của một lời gợi ý sách", shape: "Bạn thử đọc “_____” của _____ (____).",
      fills: [["Giọt đắng", "nghe như tên sách"], ["Trần Minh Khang", "nghe như tên tác giả"], ["2014", "nghe như năm xuất bản"]], noCheck: "không bước nào kiểm tra sách có thật hay không",
      examTitle: "cách chấm câu trả lời", scored: [["“Tôi không biết.”", "0 điểm"], ["một câu đoán chắc nịch", "đôi khi\nđúng: 1 điểm"]], examCaption: "thà khoanh bừa còn hơn bỏ trống",
      checks: ["đưa nó nguồn\ntài liệu", "hỏi mỗi thông tin\nlấy từ đâu", "kiểm tra tên,\nsố liệu, trích dẫn"],
    },
    resp: {
      past: "từng được tuyển", model: "mô hình", ranked: "ứng viên mới", copies: "nó học theo cả định kiến cũ",
      paste: "dán vào khung chat:", card: ["lương: 52.000", "số CCCD", "hồ sơ sức khỏe"], where: ["lưu ở đâu?", "dùng để\nhuấn luyện?", "ai xem được?"],
      leakCaption: "biết dữ liệu đi đâu trước khi chia sẻ",
      application: "hồ sơ vay", denied: "từ chối", why: "vì sao?", noReason: "không ai giải thích được",
      suggests: "AI đề xuất", person: "người kiểm tra", decision: "quyết định", override: "và có thể bác bỏ", owner: "luôn có người chịu trách nhiệm",
    },
  },
};
