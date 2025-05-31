import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://brandlogos.net/wp-content/uploads/2025/05/strava-logo_brandlogos.net_l1hwc-768x152.png",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://brandlogos.net/wp-content/uploads/2025/05/air_astana-logo_brandlogos.net_qmq5z-512x127.png",
  },
 
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://brandlogos.net/wp-content/uploads/2025/05/walmart_wordmark_2025-logo_brandlogos.net_4xgvi-512x96.png",
  },
  {
    name: "Jenny",
    username: "@jennydd",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://brandlogos.net/wp-content/uploads/2025/05/pinterest_2017-logo_brandlogos.net_b92ci-512x95.png",
  },
  {
    name: "sid",
    username: "@jendny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://brandlogos.net/wp-content/uploads/2025/04/gate.io-logo_brandlogos.net_ijvu0-512x117.png"},
  {
    name: "sidd",
    username: "@jeddsnny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://brandlogos.net/wp-content/uploads/2025/04/acorns-logo_brandlogos.net_yzwxi-512x139.png"},
 
];

const firstRow = reviews.slice(0, reviews.length );


const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <div className="mx-8">
      <span>

      <img className="" width="212" height="212"alt="" src={img} />
      </span>
    </div>
  );
};

export default function TrustedPartners() {
  return (
    <div className="relative flex w-5xl mx-auto flex-col items-center justify-center overflow-hidden">
      <span className="mt-6 mb-10"><h1 className="text-4xl font-bold">Trusted buy the Giants</h1></span>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
