import type { FeedFriendRow } from "@/features/feed/types/feed";

export type ExploreItem = {
  id: string;
  label: string;
  href: string;
  badge?: "new";
  wide?: boolean;
};

export const exploreItems: ExploreItem[] = [
  { id: "learning", label: "Learning", href: "#0", badge: "new" },
  { id: "insights", label: "Insights", href: "#0", wide: true },
  { id: "friends", label: "Find friends", href: "#0", wide: true },
  { id: "bookmarks", label: "Bookmarks", href: "#0", wide: true },
  { id: "group", label: "Group", href: "#0", wide: true },
  { id: "gaming", label: "Gaming", href: "#0", badge: "new", wide: true },
  { id: "settings", label: "Settings", href: "#0", wide: true },
  { id: "save", label: "Save post", href: "#0", wide: true },
];

export type SuggestedPerson = {
  id: string;
  name: string;
  role: string;
  image: string;
  wideImage?: boolean;
};

export const suggestedPeople: SuggestedPerson[] = [
  {
    id: "1",
    name: "Steve Jobs",
    role: "CEO of Apple",
    image: "/images/people1.png",
    wideImage: true,
  },
  {
    id: "2",
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    image: "/images/people2.png",
  },
  {
    id: "3",
    name: "Dylan Field",
    role: "CEO of Figma",
    image: "/images/people3.png",
  },
];

export type NotificationEntry =
  | {
      id: string;
      kind: "post";
      name: string;
      time: string;
    }
  | {
      id: string;
      kind: "group";
      time: string;
    };

export const notificationEntries: NotificationEntry[] = [
  { id: "n1", kind: "post", name: "Steve Jobs", time: "42 miniutes ago" },
  { id: "n2", kind: "group", time: "42 miniutes ago" },
  { id: "n3", kind: "post", name: "Steve Jobs", time: "42 miniutes ago" },
  { id: "n4", kind: "group", time: "42 miniutes ago" },
  { id: "n5", kind: "post", name: "Steve Jobs", time: "42 miniutes ago" },
  { id: "n6", kind: "group", time: "42 miniutes ago" },
];

export const friendsList: FeedFriendRow[] = [
  {
    id: "f1",
    name: "Steve Jobs",
    title: "CEO of Apple",
    image: "/images/people1.png",
    side: "time",
    timeLabel: "5 minute ago",
    inactive: true,
  },
  {
    id: "f2",
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    image: "/images/people2.png",
    side: "online",
  },
  {
    id: "f3",
    name: "Dylan Field",
    title: "CEO of Figma",
    image: "/images/people3.png",
    side: "online",
  },
  {
    id: "f4",
    name: "Steve Jobs",
    title: "CEO of Apple",
    image: "/images/people1.png",
    side: "time",
    timeLabel: "5 minute ago",
    inactive: true,
  },
  {
    id: "f5",
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    image: "/images/people2.png",
    side: "online",
  },
  {
    id: "f6",
    name: "Dylan Field",
    title: "CEO of Figma",
    image: "/images/people3.png",
    side: "online",
  },
  {
    id: "f7",
    name: "Dylan Field",
    title: "CEO of Figma",
    image: "/images/people3.png",
    side: "online",
  },
  {
    id: "f8",
    name: "Steve Jobs",
    title: "CEO of Apple",
    image: "/images/people1.png",
    side: "time",
    timeLabel: "5 minute ago",
    inactive: true,
  },
];
