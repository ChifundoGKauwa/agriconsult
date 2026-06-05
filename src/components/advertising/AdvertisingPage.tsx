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
  const [searchQuery, setSearchQuery] = useState("");
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);

    // Pre-load PayChangu scripts so they're ready for click handlers
  

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

  // Filtered listings based on search only
  const filteredListings = displayListings.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.price.toLowerCase().includes(q)
    );
  });

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

  const makePayment = async (item: { title: string; price: string }) => {
  try {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: item.title,
        price: item.price,
        email: user?.email,
      }),
    });

    const data = await response.json();
    window.location.href = data.checkout_url;
  } catch (error) {
    console.error("Payment failed:", error);
  }
};

  return (
    <div className="flex flex-col bg-neutral text-primary">
      {/* Hero + Upload + Filters */}
      <section className="bg-white py-10">
        <Container className="space-y-8">
          {/* Header row */}
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isSaving ? "Saving..." : "Upload advertisement"}
              </Button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, or price..."
              className="h-10 w-full rounded-xl border border-secondary/20 bg-white pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-primary"
              >
                ✕
              </button>
            )}
          </div>

          {/* Listings header */}
          <div className="flex items-center justify-between text-xs text-secondary">
            <span>Showing {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"}</span>
            <span>Sort by: Newest First</span>
          </div>
        </Container>
      </section>

      {/* Product Listings Grid */}
      <section className="bg-white pb-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((item) => (
              <Card key={item.title} className="border-secondary/20">
                <div className="relative h-36 overflow-hidden rounded-t-2xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                <CardFooter className="flex gap-2">
                  <Button variant="ghost" className="px-0">
                    View listing
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-primary hover:bg-tertiary ml-auto"
                    onClick={() => makePayment(item)}
                  >
                    Buy
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
