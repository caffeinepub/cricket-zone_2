export interface MockVideo {
  id: string;
  title: string;
  matchInfo: string;
  description: string;
  thumbnailUrl: string;
  isLive: boolean;
  duration: string;
  date: string;
  teams: [string, string];
  score?: string;
}

export const mockVideos: MockVideo[] = [
  {
    id: "mi-csk-2024-01",
    title: "MI vs CSK — Clash of Titans",
    matchInfo: "MI vs CSK • IPL 2024 • Match 1",
    description:
      "Mumbai Indians take on Chennai Super Kings in the IPL 2024 opener at Wankhede Stadium. Rohit Sharma's explosive batting against MS Dhoni's legendary captaincy.",
    thumbnailUrl: "/assets/generated/match-mi-csk.dim_400x220.jpg",
    isLive: true,
    duration: "LIVE",
    date: "Today, 7:30 PM IST",
    teams: ["MI", "CSK"],
    score: "MI 142/3 (16.2 ov)",
  },
  {
    id: "rcb-kkr-2024-02",
    title: "RCB vs KKR — Battle of Eden",
    matchInfo: "RCB vs KKR • IPL 2024 • Match 2",
    description:
      "Royal Challengers Bangalore face Kolkata Knight Riders at Eden Gardens. Virat Kohli in destructive form against the purple brigade.",
    thumbnailUrl: "/assets/generated/match-rcb-kkr.dim_400x220.jpg",
    isLive: true,
    duration: "LIVE",
    date: "Today, 3:30 PM IST",
    teams: ["RCB", "KKR"],
    score: "RCB 98/2 (11.0 ov)",
  },
  {
    id: "dc-rr-2024-03",
    title: "DC vs RR — Capital Clash",
    matchInfo: "DC vs RR • IPL 2024 • Match 3",
    description:
      "Delhi Capitals go head-to-head with Rajasthan Royals at the Arun Jaitley Stadium. Jos Buttler vs Rishabh Pant — the ultimate T20 showdown.",
    thumbnailUrl: "/assets/generated/match-dc-rr.dim_400x220.jpg",
    isLive: false,
    duration: "3h 12m",
    date: "Yesterday, 7:30 PM IST",
    teams: ["DC", "RR"],
  },
  {
    id: "srh-pk-2024-04",
    title: "SRH vs PBKS — Orange Army Roars",
    matchInfo: "SRH vs PBKS • IPL 2024 • Match 4",
    description:
      "Sunrisers Hyderabad march against Punjab Kings in a high-octane contest. Heinrich Klaasen and Shikhar Dhawan battle it out at Rajiv Gandhi Stadium.",
    thumbnailUrl: "/assets/generated/match-srh-pk.dim_400x220.jpg",
    isLive: false,
    duration: "2h 58m",
    date: "Mar 28, 7:30 PM IST",
    teams: ["SRH", "PBKS"],
  },
  {
    id: "gt-lsg-2024-05",
    title: "GT vs LSG — New India Derby",
    matchInfo: "GT vs LSG • IPL 2024 • Match 5",
    description:
      "Gujarat Titans clash with Lucknow Super Giants in a battle between two of IPL's newest franchises. Shubman Gill leads GT against KL Rahul's LSG.",
    thumbnailUrl: "/assets/generated/match-gt-lsg.dim_400x220.jpg",
    isLive: false,
    duration: "3h 05m",
    date: "Mar 27, 7:30 PM IST",
    teams: ["GT", "LSG"],
  },
  {
    id: "csk-rcb-2024-06",
    title: "CSK vs RCB — IPL Classic",
    matchInfo: "CSK vs RCB • IPL 2024 • Match 6",
    description:
      "The most iconic rivalry in IPL history reignites at M.A. Chidambaram Stadium. MS Dhoni's final season farewell against Virat Kohli's relentless RCB.",
    thumbnailUrl: "/assets/generated/match-mi-csk.dim_400x220.jpg",
    isLive: false,
    duration: "3h 22m",
    date: "Mar 26, 7:30 PM IST",
    teams: ["CSK", "RCB"],
  },
];
