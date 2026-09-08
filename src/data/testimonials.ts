import { asset } from "./site";

/** Featured video testimonials at top of /המלצות — streamed from Wix CDN */
export const featuredVideoTestimonials = [
  {
    name: "יעל",
    poster: asset("44c6b1_db1995abdaf845de9c5a03702bc83e4af003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_db1995abdaf845de9c5a03702bc83e4a/480p/mp4/file.mp4",
  },
  {
    name: "מרים",
    poster: asset("44c6b1_756cff09dd6740a6acdf6ffcaac3ca7df003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_756cff09dd6740a6acdf6ffcaac3ca7d/480p/mp4/file.mp4",
  },
  {
    name: "חנה",
    poster: asset("44c6b1_322109697fc549f384911d07406caad7f003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_322109697fc549f384911d07406caad7/480p/mp4/file.mp4",
  },
  {
    name: "רפאל",
    poster: asset("44c6b1_2c5da40fb42246c7af08cb3354edfcb9f003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_2c5da40fb42246c7af08cb3354edfcb9/480p/mp4/file.mp4",
  },
  {
    name: "ליאת",
    poster: asset("44c6b1_adf9111900f144a9ae949782a1db12fbf003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_adf9111900f144a9ae949782a1db12fb/480p/mp4/file.mp4",
  },
  {
    name: "שלי",
    poster: asset("44c6b1_3a1d1f1c2f5b4fb5a1a63bfe32e9628ef003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_3a1d1f1c2f5b4fb5a1a63bfe32e9628e/480p/mp4/file.mp4",
  },
  {
    name: "נטי",
    poster: asset("44c6b1_1fbce7c58dd743d0a12cbc1022fc4f7af003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_1fbce7c58dd743d0a12cbc1022fc4f7a/480p/mp4/file.mp4",
  },
  {
    name: "ינטי",
    poster: asset("44c6b1_b59d2965507647c8aa9721778c6ce7faf003.jpg"),
    video: "https://video.wixstatic.com/video/44c6b1_b59d2965507647c8aa9721778c6ce7fa/480p/mp4/file.mp4",
  },
] as const;

export const testimonialNavCards = [
  {
    id: "workshops-recs",
    title: "סדנאות",
    icon: asset("testimonial-cats/workshops.svg"),
  },
  {
    id: "personal",
    title: "מפגשים אישיים",
    icon: asset("testimonial-cats/personal.svg"),
  },
] as const;

export const personalTestimonials = [
  { src: asset("44c6b1_b7e1b851d4994f1fa72ab93c5626b8ac~mv2.jpg"), alt: "נומרולוגית מומלצת" },
  { src: asset("44c6b1_64d900345f24463bb5615318ba87e5b1~mv2.jpeg"), alt: "המלצה על מפגש אישי בנומרולוגיה עם מיטל גוטמן שקד" },
  { src: asset("44c6b1_6b250f6d382d472f96c5bfdad66c98e8~mv2.jpeg"), alt: "המלצה על מיטל גוטמן שקד נומרולוגית מומלצת" },
  { src: asset("44c6b1_cc0fbafc8088404eb641c6e9001e6a43~mv2.jpeg"), alt: "מפגש אישי בנומרולוגיה לפי תאריך לידה" },
  { src: asset("44c6b1_a8143006bded4e2abfeada8d136821f7~mv2.jpeg"), alt: "ייעוץ נומרולוגי" },
  { src: asset("44c6b1_37b8934f996e43dbaf7de803b978068a~mv2.jpeg"), alt: "אבחון נומרולוגי ללקוחה" },
  { src: asset("44c6b1_bb4440a435dc4a699ab5c24579805501~mv2.jpeg"), alt: "המלצה לגבי ייעוץ נומרולוגי במפגש אישי" },
  { src: asset("44c6b1_31501464115241fe80bb6571e86f171e~mv2.jpeg"), alt: "נומרולוגית מומלצת" },
  { src: asset("44c6b1_313a9aa4a686457989775624c516ccce~mv2.jpeg"), alt: "נומרולוגית מומלצת" },
  { src: asset("44c6b1_5cd1bca8c93d4ff09d1a579f7d2a9788~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_54058f2809c246ceb0dda90030e507d6~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית" },
  { src: asset("44c6b1_d4a852db5cd14041b02b84456ff907d6~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_236a6ed2908f4992b0c05387a9b5c86a~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_ad018d7d17ce46ecac0c1f0fe9d2157d~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_7239a250eabd49129c8e7a11c15d23fc~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_d48bd69645294548a09c63605afb6df3~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_5a60854314e64b908b719117e7a9fb5c~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_cb75a74418834028b0ea21c011e80734~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_5a51997b202d4f729893a17b2057f591~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_fcfe068f91654529be65ae65b6c1e758~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_831acfa50e3f43b2ad974a1a733495a4~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_de47a60ea3d34b85af640a19d4bc5260~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_75c12a803f574f25a7a35808f900fb13~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_272cebdb64ea481e92ad400499223ff6~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
  { src: asset("44c6b1_8f02b3915dd443b1a281cb79a98aea4a~mv2.jpg"), alt: "המלצה על מיטל גוטמן שקד - נומרולוגית מומלצת" },
] as const;

export const workshopTestimonials = [
  { src: asset("44c6b1_112194a58fdf4a57abb4b58556919398~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_5c10047f2cfb408c8eb28165a383173a~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_45a503fbf7e64099a6c1bc68dd7b94ef~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_e9a79ed107a3410489abcda13d03ef86~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_72150703e0c9409fa07a8e4e8fb5aef0~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_15770fd9775749e588ebe790e914a5fe~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_b737cfc8c4b2414eaa99efadba579489~mv2.jpg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_b0ae9b69aa574e91a5fae5bf0499e025~mv2.jpg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_be6605061f3b4e3283c08a0b67387568~mv2.jpg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_006b620426b84064b927ec72c5d84f1b~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_fd31c15c1735475cbdd1ae017d905d29~mv2.png"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_8798d1733303494c9721cc5f8a1a934d~mv2.jpg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_691f88276cc24562830aec92ba2f10cf~mv2.jpg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_9080a4dec7b1407e97ccb22a4b7aabcd~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_dec68d1be0a74e6b91b563f60ea1d19d~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
  { src: asset("44c6b1_6fecea8b40714e17af571c563d9c7e1d~mv2.jpeg"), alt: "המלצה לגבי סדנאות נומרולוגיה של מיטל גוטמן שקד" },
] as const;
