"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";
import { isAdmin } from "@/src/lib/admin";
import { StatsCard } from "@/src/components/ui/stats-card";
import { SimpleBarChart } from "@/src/components/ui/bar-chart";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";

const ADVERTISEMENTS_COLLECTION = "images";
const SALES_COLLECTION = "sales";

type AdDoc = {
  id: string;
  imageurl: string;
  title: string;
  price: string;
  createdAt?: Timestamp;
};

type SaleDoc = {
  id: string;
  productId: string;
  productTitle: string;
  amount: number;
  buyerEmail: string;
  createdAt?: Timestamp;
};

type CloudinaryUploadInfo = {
  public_id: string;
  secure_url: string;
};

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<AdDoc[]>([]);
  const [sales, setSales] = useState<SaleDoc[]>([]);
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

  // Fetch ads
  useEffect(() => {
    const q = query(collection(db, ADVERTISEMENTS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setAds(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdDoc)));
    });
  }, []);

  // Fetch sales
  useEffect(() => {
    const q = query(collection(db, SALES_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setSales(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SaleDoc)));
    });
  }, []);

  // Analytics
  const totalAds = ads.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("en-US", { month: "short" });
      months[key] = 0;
    }
    sales.forEach((s) => {
      if (s.createdAt) {
        const d = new Date((s.createdAt as Timestamp).toDate?.() ?? s.createdAt);
        const key = d.toLocaleString("en-US", { month: "short" });
        if (months[key] !== undefined) months[key] += s.amount || 0;
      }
    });
    return Object.entries(months).map(([label, value]) => ({ label, value }));
  }, [sales]);

  const handleUploadSuccess = (result: unknown) => {
    const r = result as { info?: string | CloudinaryUploadInfo };
    if (!r.info || typeof r.info === "string") return;
    setUploadedImageUrl(r.info.secure_url);
    setUploadedPublicId(r.info.public_id);
  };

  const handleSaveAd = async () => {
    if (!uploadedImageUrl || !uploadedPublicId || !formTitle) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, ADVERTISEMENTS_COLLECTION), {
        imageurl: uploadedImageUrl,
        publicID: uploadedPublicId,
        userID: user?.uid || "admin",
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

  if (!user) {
    return (
      <Container className="py-32 text-center">
        <p className="text-secondary">Please sign in to access the dashboard.</p>
      </Container>
    );
  }

  if (!isAdmin(user.email)) {
    return (
      <Container className="py-32 text-center">
        <Badge>Access Denied</Badge>
        <h1 className="mt-4 text-2xl font-semibold">Admin access only</h1>
        <p className="mt-2 text-sm text-secondary">Your email is not authorized for this dashboard.</p>
      </Container>
    );
  }

  return (
    <div className="flex flex-col bg-neutral text-primary">
      <section className="bg-white py-10">
        <Container className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Badge>Admin Dashboard</Badge>
              <h1 className="mt-2 text-3xl font-semibold">Manage Products</h1>
            </div>
            <Button
              size="sm"
              className="bg-accent text-primary hover:bg-tertiary"
              onClick={() => setShowUploadModal(true)}
              disabled={isSaving}
            >
              + Upload Ad
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard title="Total Uploads" value={totalAds} />
            <StatsCard title="Items Sold" value={totalSales} />
            <StatsCard
              title="Total Revenue"
              value={`MWK ${totalRevenue.toLocaleString()}`}
            />
          </div>

          {/* Chart */}
          <SimpleBarChart title="Revenue Trend (6 months)" data={monthlyData} />

          {/* Ads List */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">All Uploads</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ads.length === 0 ? (
                <p className="col-span-full text-sm text-secondary">No ads uploaded yet.</p>
              ) : (
                ads.map((ad) => (
                  <Card key={ad.id} className="border-secondary/20">
                    {ad.imageurl && (
                      <div className="relative h-36 overflow-hidden rounded-t-2xl">
                        <Image src={ad.imageurl} alt={ad.title || ""} fill className="object-cover" sizes="25vw" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-base">{ad.title || "Untitled"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-semibold text-primary">{ad.price || "Price not set"}</p>
                    </CardContent>
                  </Card>
                ))
              )}
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
                onClick={() => setShowUploadModal(false)}
                className="text-secondary hover:text-primary"
              >
                ✕
              </button>
            </div>

            {!uploadedImageUrl ? (
              <CldUploadWidget uploadPreset={uploadPreset!} onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-secondary/30 p-10">
                    <p className="text-sm text-secondary">Upload product image</p>
                    <Button onClick={() => open?.()} className="bg-primary text-white">
                      Choose Image
                    </Button>
                  </div>
                )}
              </CldUploadWidget>
            ) : (
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-xl">
                  <Image src={uploadedImageUrl} alt="Preview" fill className="object-cover" sizes="500px" />
                </div>
                <input
                  type="text"
                  placeholder="Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-secondary/20 px-4 py-2.5 text-sm outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-secondary/20 px-4 py-2.5 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Price (e.g. MWK 120,000)"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full rounded-xl border border-secondary/20 px-4 py-2.5 text-sm outline-none"
                />
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                  <Button onClick={handleSaveAd} disabled={isSaving || !formTitle} className="bg-primary text-white">
                    {isSaving ? "Saving..." : "Publish"}
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
