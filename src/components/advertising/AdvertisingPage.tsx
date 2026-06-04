"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { auth, db } from "@/src/lib/firebase";

const ADVERTISEMENTS_COLLECTION = "images";

type Advertisement = {
  id: string;
  imageurl: string;
  publicID: string;
  userID: string;
  title: string;
  description: string;
  price: string;
  createdAt?: Timestamp;
};

type CloudinaryUploadInfo = {
  public_id: string;
  secure_url: string;
};

const featuredCards = [
  {
    title: "Malawi Gold Hybrid Pigs",
    subtitle: "Premium grade livestock",
    price: "MWK 4,500,000",
    image: "/pigs.png",
  },
  {
    title: "Premium Grade A Maize",
    subtitle: "Seasonal export lots",
    price: "MWK 420,000",
    image: "/maize.png",
  },
  {
    title: "Organic Soya Beans",
    subtitle: "High-protein harvest",
    price: "MWK 145,000",
    image: "/soya.png",
  },
  {
    title: "Organic Beans",
    subtitle: "Wholesale contract",
    price: "MWK 112,500",
    image: "/beans.png",
  },
];

const listings = [
  {
    title: "Large White Breeding Gilts",
    subtitle: "Certified healthy stock",
    price: "MWK 120,500",
    image: "/pigs.png",
  },
  {
    title: "Bulk Yellow Maize",
    subtitle: "High energy density",
    price: "MWK 420,000",
    image: "/maize.png",
  },
  {
    title: "Non-GMO Soya Beans",
    subtitle: "Cleaned and graded",
    price: "MWK 145,000",
    image: "/soya.png",
  },
  {
    title: "Organic Beans Supply",
    subtitle: "Sorted export lots",
    price: "MWK 112,500",
    image: "/beans.png",
  },
];

export default function AdvertisingPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);

    return unsubscribe;
  }, []);

  useEffect(() => {
    const adsQuery = query(
      collection(db, ADVERTISEMENTS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      adsQuery,
      (snapshot) => {
        setAdvertisements(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Advertisement, "id">),
          }))
        );
      },
      (error) => {
        console.error("Firestore could not load advertisements:", error.message);
      }
    );

    return unsubscribe;
  }, []);

  const marketplaceListings = useMemo(
    () =>
      advertisements.map((advertisement) => ({
        title: advertisement.title || `Advertisement`,
        subtitle: advertisement.description || "No description",
        price: advertisement.price || "Contact seller",
        image: advertisement.imageurl,
      })),
    [advertisements]
  );

  const displayListings = marketplaceListings.length
    ? marketplaceListings
    : listings;

  const handleUploadSuccess = (result: unknown) => {
    const uploadResult = result as { info?: string | CloudinaryUploadInfo };

    if (!uploadResult.info || typeof uploadResult.info === "string") {
      return;
    }

    setUploadedImageUrl(uploadResult.info.secure_url);
    setUploadedPublicId(uploadResult.info.public_id);
  };

  const handleSaveAd = async () => {
    if (!user || !uploadedImageUrl || !uploadedPublicId) return;

    setIsSaving(true);

    try {
      await addDoc(collection(db, ADVERTISEMENTS_COLLECTION), {
        imageurl: uploadedImageUrl,
        publicID: uploadedPublicId,
        userID: user.uid,
        title: formTitle,
        description: formDescription,
        price: formPrice,
        createdAt: serverTimestamp(),
      });

      setShowUploadModal(false);
      setFormTitle("");
      setFormDescription("");
      setFormPrice("");
      setUploadedImageUrl(null);
      setUploadedPublicId(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-neutral text-primary">
      <section className="bg-white py-16">
        <Container className="space-y-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold">Featured Marketplace</h1>
              <p className="max-w-2xl text-sm text-secondary">
                Top-tier agricultural products vetted by AgriConsult experts.
              </p>
            </div>
            {!uploadPreset ? (
              <Button variant="ghost" disabled>
                Upload preset missing
              </Button>
            ) : !user ? (
              <a href="/login">
                <Button
                  type="button"
                  size="sm"
                  className="bg-accent text-primary hover:bg-tertiary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Sign in to upload
                </Button>
              </a>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowUploadModal(true)}
                disabled={isSaving}
                className="bg-accent text-primary hover:bg-tertiary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isSaving ? "Saving..." : "Upload advertisement"}
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <Card className="border-secondary/20">
              <div className="relative h-80 overflow-hidden rounded-2xl">
                <Image
                  src={featuredCards[0].image}
                  alt={featuredCards[0].title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral/70">
                    Featured Product
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {featuredCards[0].title}
                  </h2>
                  <p className="text-sm text-neutral/80">
                    {featuredCards[0].subtitle}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-accent">
                      {featuredCards[0].price}
                    </span>
                    <Button size="sm" className="bg-accent text-primary hover:bg-tertiary">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4">
              <Card className="border-secondary/20">
                <div className="relative h-40 overflow-hidden rounded-2xl">
                  <Image
                    src={featuredCards[1].image}
                    alt={featuredCards[1].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-2">
                  <p className="text-sm font-semibold text-primary">
                    {featuredCards[1].title}
                  </p>
                  <p className="text-xs text-secondary">
                    {featuredCards[1].subtitle}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {featuredCards[1].price}
                  </p>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredCards.slice(2).map((item) => (
                  <Card key={item.title} className="border-secondary/20">
                    <div className="relative h-28 overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="space-y-1">
                      <p className="text-xs font-semibold text-primary">
                        {item.title}
                      </p>
                      <p className="text-xs text-secondary">{item.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-secondary">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Search Ads
                  </p>
                  <div className="rounded-xl border border-secondary/20 px-3 py-2 text-xs text-secondary">
                    Keywords...
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Livestock",
                      "Cereals",
                      "Legumes",
                      "Inputs",
                    ].map((label) => (
                      <Button key={label} size="sm" variant="outline">
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Price Range
                  </p>
                  <div className="grid gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Min</span>
                      <span>Max</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Condition
                  </p>
                 
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-secondary">
                <span>
                  Showing {displayListings.length}{" "}
                  {displayListings.length === 1 ? "listing" : "listings"}
                </span>
                <span>Sort by: Newest First</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displayListings.map((item) => (
                  <Card key={item.title} className="border-secondary/20">
                    <div className="relative h-36 overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-secondary">
                      <p>{item.subtitle}</p>
                      <p className="text-sm font-semibold text-primary">
                        {item.price}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="px-0">
                        View listing
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Advertisement</h2>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImageUrl(null);
                  setUploadedPublicId(null);
                  setFormTitle("");
                  setFormDescription("");
                  setFormPrice("");
                }}
                className="text-secondary hover:text-primary"
              >
                ✕
              </button>
            </div>

            {!uploadedImageUrl ? (
              <CldUploadWidget
                uploadPreset={uploadPreset!}
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-secondary/30 p-10">
                    <p className="text-sm text-secondary">
                      Click to upload an image first
                    </p>
                    <Button
                      type="button"
                      onClick={() => open?.()}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Choose Image
                    </Button>
                  </div>
                )}
              </CldUploadWidget>
            ) : (
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-xl">
                  <Image
                    src={uploadedImageUrl}
                    alt="Uploaded preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-secondary/20 px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
                <textarea
                  placeholder="Description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-secondary/20 px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
                <input
                  type="text"
                  placeholder="Price (e.g. MWK 120,000)"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full rounded-xl border border-secondary/20 px-4 py-2.5 text-sm outline-none focus:border-accent"
                />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadedImageUrl(null);
                      setUploadedPublicId(null);
                      setFormTitle("");
                      setFormDescription("");
                      setFormPrice("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveAd}
                    disabled={isSaving || !formTitle}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {isSaving ? "Saving..." : "Publish Advertisement"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
