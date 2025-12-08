import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import "../App.css";
import Loader from "../components/LoadingDots";
import MenuButton from "../components/MenuButton";
import RatingReviews from "../components/RatingsReviews";
import AdLoadingOverlay from "../components/AdLoadingOverlay";
import useWsChat from "../features/chat/useWsChat";
import useFavourites from "../features/products/useFavourites";
import { useMarkProductAsTaken, useOwnerProducts, useProduct, useProductReportCount, useProducts, useRelatedProducts, useReportProduct } from "../features/products/useProducts";
import useReviews from "../features/reviews/useReviews";
import { useUserSubscriptions } from "../features/subscriptions/useSubscriptions";
import useUserProfile from "../features/userProfile/useUserProfile";
import type { Message as ChatMessage } from "../services/chatService";
import { resolveChatroomId } from "../services/chatService";
import { likeReview } from "../services/reviewService";
import type { Product } from "../types/Product";
import type { ProductFeature } from "../types/ProductFeature";
import type { Review } from "../types/Review";
import { formatMoney } from "../utils/formatMoney";
import { formatReviewDate } from "../utils/formatReviewDate";

const AdsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? +id : null;
  const navigate = useNavigate();
  const location = useLocation();
  const adDataFromState = location.state?.adData;

  const {
    data: currentAdDataFromQuery,
    isLoading: adLoading,
    error: adError,
  } = useProduct(numericId!);
  const { data: ads = [], isLoading: adsLoading } = useProducts();
  const { profile: currentUserProfile } = useUserProfile();
  const { reviews: reviews = [] } = useReviews();
  const { data: userSubscriptions = [] } = useUserSubscriptions();

  const activeUserSubscription = (userSubscriptions as any[]).find((us) => us?.is_active) || null;
  const subscriptionMultiplierRaw = activeUserSubscription?.subscription?.multiplier ?? null;
  const multiplierLabel = (() => {
    if (subscriptionMultiplierRaw == null) return null;
    const n = Number(subscriptionMultiplierRaw);
    if (!Number.isNaN(n)) return `x${n}`;
    return String(subscriptionMultiplierRaw);
  })();

  // chat hook (declare early before any conditional returns)
  const { sendMessage, addLocalMessage } = useWsChat();

  // Favourites hook and local state (declare early to obey hook rules)
  const { data: favourites = [], toggleFavourite } = useFavourites();
  const [isFavourited, setIsFavourited] = useState<boolean>(false);
  const [animatingLikes, setAnimatingLikes] = useState<Set<number>>(new Set());
  const [isAdLoading, setIsAdLoading] = useState(false);

  // mark-as-taken mutation (declare early)
  const markTaken = useMarkProductAsTaken();

  useEffect(() => {
    const favFromProduct = Boolean((currentAdDataFromQuery as Product)?.favourited_by_user);
    const favFromList = favourites.some((p) => p.id === (currentAdDataFromQuery)?.id);
    setIsFavourited(Boolean(favFromProduct || favFromList));
  }, [currentAdDataFromQuery, favourites]);

  const handleToggleFavourite = () => {
    const pid = (currentAdDataFromQuery)?.id || (adDataFromState)?.id || null;
    if (!pid) return;
    // prevent duplicate rapid clicks while a mutation is in-flight
    if (toggleFavourite.status === "pending") {
      console.debug("handleToggleFavourite: mutation already in-flight", { pid });
      return;
    }
    console.debug("handleToggleFavourite: toggling", { pid, at: Date.now() });
    setIsFavourited((s) => !s);
    toggleFavourite.mutate(pid);
  };

  const handleMarkAsTaken = () => {
    const pid = (currentAdDataFromQuery)?.id || (adDataFromState)?.id || numericId;
    if (!pid) return;

    toast.promise(
      Promise.resolve().then(() => {
        // assemble a full product payload to match backend schema expectations
        const src = currentAdDataFromQuery || adDataFromState || currentAdData || {};
        const payload = {
          pid: (src)?.pid ?? `pid_${pid}`,
          name: (src)?.name ?? "",
          image: src?.image ?? (src?.images?.[0]?.image ?? ""),
          type: (src)?.type ?? ("SALE" as const),
          status: (src)?.status ?? ("ACTIVE" as const),
          is_taken: true,
          description: (src)?.description ?? "",
          price: (src)?.price ?? 0,
          duration: (src)?.duration ?? "",
          category: (src)?.category ?? (src)?.category_id ?? 0,
        } as Record<string, unknown>;

        // call mutation with full payload so server receives the expected schema
        markTaken.mutate({ id: pid, body: payload });
      }),
      {
        loading: "Sending alert to owner to mark ad as taken...",
        success: "Alert sent to owner to mark ad as taken!",
        error: "Failed to send alert to owner to mark ad as taken",
      }
    );
  };

  const handleReportAd = () => {
    const pid = (currentAdDataFromQuery)?.id || (adDataFromState)?.id || numericId;
    if (!pid) return;

    toast.promise(
      Promise.resolve().then(() => {
        const src = currentAdDataFromQuery || adDataFromState || currentAdData || {};
        const payload = {
          pid: (src)?.pid ?? `pid_${pid}`,
          name: (src)?.name ?? "",
          image: (src)?.image ?? (src?.images?.[0]?.image ?? ""),
          type: (src)?.type ?? ("SALE" as const),
          status: (src)?.status ?? ("ACTIVE" as const),
          is_taken: Boolean((src)?.is_taken),
          description: (src)?.description ?? "",
          price: (src)?.price ?? 0,
          duration: (src)?.duration ?? "",
          category: (src)?.category ?? (src)?.category_id ?? 0,
        } as Record<string, unknown>;

        reportProduct.mutate({ id: pid, body: payload });
      }),
      {
        loading: "Reporting ad...",
        success: "Ad reported successfully!",
        error: "Failed to report ad",
      }
    );
  };

  // Determine a candidate owner id early so hooks can be called unconditionally
  const ownerIdCandidate =
    adDataFromState?.owner?.id ?? currentAdDataFromQuery?.owner?.id ??
    ads.find((a) => a.id === numericId)?.owner?.id ?? undefined;

  // fetch seller's products from backend via hook (call unconditionally)
  const ownerProductsQuery = useOwnerProducts(ownerIdCandidate as number | undefined);
  const sellerProducts = ownerProductsQuery.data ?? [];

  // fetch related products (for Similar Ads section)
  const { data: relatedProducts = [] } = useRelatedProducts(numericId ?? undefined);
  const reportProduct = useReportProduct();
  const { data: reportCount = 0 } = useProductReportCount(numericId ?? undefined);
  const queryClient = useQueryClient();
  const likeMutation = useMutation({
    mutationFn: async ({ id, body }: { id: number; body?: any }) => likeReview(id, body),
    onSuccess: (data: any) => {
      // update single review cache and refresh reviews lists
      queryClient.setQueryData(["review", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review liked!");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to like review";
      toast.error(message);
    },
  });

  // Caller phone tooltip visibility (hook must be declared before any early returns)
  const [showCaller1, setShowCaller1] = useState(false);
  const [showCaller2, setShowCaller2] = useState(false);
  const [quickChatInput, setQuickChatInput] = useState("");


  const productReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return reviews.filter((r: Review) => r.product?.id === numericId);
  }, [reviews, numericId]);

  const thisProductsReviews = reviews.filter(
    (review) => review?.product.id === numericId,
  );

  const reviewDeconstruction = thisProductsReviews.reduce(
    (acc, p) => {
      const star = Math.round(p.rating) as 5 | 4 | 3 | 2 | 1;
      return {
        sum: acc.sum + p.rating,
        count: acc.count + 1,
        avg: (acc.sum + p.rating) / (acc.count + 1),
        stars: {
          ...acc.stars,
          [star]: (acc.stars[star] || 0) + 1,
        },
      };
    },
    {
      sum: 0,
      count: 0,
      avg: 0,
      stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
  );

  const touchStartX = useRef<number | null>(null);

  // Gallery state: keep hooks above any early returns so they're
  // invoked unconditionally on every render.
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  useEffect(() => {
    // reset index when route/ad (id) changes
    setGalleryIndex(0);
  }, [id]);

  // Modal state for picture viewer
  const [isPictureModalOpen, setIsPictureModalOpen] = useState<boolean>(false);
  const [pictureModalIndex, setPictureModalIndex] = useState<number>(0);
  // when modal closes, sync page gallery index
  useEffect(() => {
    if (!isPictureModalOpen) {
      setGalleryIndex(pictureModalIndex);
    }
  }, [isPictureModalOpen, pictureModalIndex]);

  // Keyboard handling for modal (registered unconditionally; only active when open)
  useEffect(() => {
    if (!isPictureModalOpen) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setIsPictureModalOpen(false);
      if (ev.key === "ArrowLeft") setPictureModalIndex((i) => Math.max(0, i - 1));
      if (ev.key === "ArrowRight") setPictureModalIndex((i) => i + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPictureModalOpen]);

  // derived image list and count (safe, uses currentAdData later)
  // we'll compute the concrete array after currentAdData is available


  if (!id || numericId === null)
    return (
      <p className="h-screen w-screen m-0 flex items-center justify-center">
        Invalid ad ID
      </p>
    );
  if (adError)
    return (
      <p className="h-screen w-screen m-0 flex flex-col items-center justify-center">
        <span className="text-8xl font-bold text-gray-400 animate-pulse">404</span>
        <span>There was an error loading this ad</span>
        <span className="text-3xl">(┬┬﹏┬┬)</span>
      </p>
    );

  const currentIndex = ads.findIndex((a) => a.id === numericId) ?? 0;
  const totalAds = ads.length;
  const currentAdData =
    adDataFromState || currentAdDataFromQuery || ads[currentIndex];
  console.log("AdsDetailsPage: currentAdData", { currentAdData });
  // derive a simple list of image URLs for the gallery. Backend may
  // provide `images` as array of objects or a single `image` string.
  const pageImages: string[] = (() => {
    const imgs = (currentAdData as any)?.images;
    if (Array.isArray(imgs) && imgs.length > 0) {
      return imgs.map((it: any) => (typeof it === "string" ? it : it?.image || it?.url || "/no-image.jpeg"));
    }
    if ((currentAdData as any)?.image) return [(currentAdData as any).image];
    return [];
  })();

  const imageCount = pageImages.length;


  // derive owner contact numbers (prefer canonical fields)
  const owner = (currentAdData?.owner || currentAdDataFromQuery?.owner || adDataFromState?.owner);
  const callerNumber1: string | null = owner?.phone || owner?.phone_number || owner?.primary_phone || null;
  const callerNumber2: string | null = owner?.phone2 || owner?.secondary_phone || owner?.alt_phone || null;
  const toggleCaller1 = () => setShowCaller1((s) => !s);
  const toggleCaller2 = () => setShowCaller2((s) => !s);

  const getLikeCount = (p: any) => {
    if (!p) return 0;
    return (
      (typeof p.liked_count === "number" && p.liked_count) ||
      (typeof p.likes_count === "number" && p.likes_count) ||
      (typeof p.likes === "number" && p.likes) ||
      (typeof p.favourites_count === "number" && p.favourites_count) ||
      (typeof p.favourited_count === "number" && p.favourited_count) ||
      (typeof p.favourite_count === "number" && p.favourite_count) ||
      0
    );
  };

  const favouriteCount = getLikeCount(currentAdData) || getLikeCount(currentAdDataFromQuery) || favourites.length || 0;

  // const ownerId = currentAdData?.owner?.id ?? null;

  const openChatWithOwnerAndSend = async (text: string) => {
    if (!owner || !owner.id) {
      // fallback: just go to inbox
      navigate("/inbox");
      return;
    }

    try {
      // resolve a chatroom id for this owner/product (use GET endpoint to avoid POST 405)
      const params: Record<string, unknown> = {
        user_id: owner.id,
        product_id: currentAdData?.id ?? numericId,
      };
      const res = await resolveChatroomId(params as any);
      // resolveChatroomId returns { room_id: string } or similar
      const roomKey = (res as any)?.room_id || String((res as any)?.room || (res as any)?.id);

      // optimistic local message
      const tempId = `tmp_${Date.now()}`;
      const tempMsg = {
        id: -Date.now(),
        room: roomKey as any,
        sender: {
          id: currentUserProfile?.id ?? 0,
          name: currentUserProfile?.name ?? "You",
          avatar: (currentUserProfile as any)?.avatar ?? null,
        } as any,
        content: text,
        created_at: new Date().toISOString(),
        is_read: false,
        // keep temp ids for reconciliation
        __temp_id: tempId,
        __optimistic: true,
      } as unknown as ChatMessage;

      try {
        addLocalMessage(String(roomKey), tempMsg as ChatMessage);
      } catch (err) {
        console.warn("AdsDetailsPage: addLocalMessage failed", err);
      }

      // attempt to send
      try {
        await sendMessage(String(roomKey), text, tempId);
      } catch (err) {
        console.warn("AdsDetailsPage: sendMessage failed", err);
      }

      // navigate to inbox and open the room
      navigate("/inbox", { state: { openRoom: String(roomKey) } });
    } catch (err) {
      console.warn("AdsDetailsPage: createChatRoom/send failed", err);
      navigate("/inbox");
    }
  };



  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const prevAd = ads[currentIndex - 1];
      setIsAdLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate(`/ads/${prevAd.id}`, { state: { adData: prevAd } });
      setTimeout(() => setIsAdLoading(false), 500);
    }
  };

  const handleNext = async () => {
    if (currentIndex < totalAds - 1) {
      const nextAd = ads[currentIndex + 1];
      setIsAdLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate(`/ads/${nextAd.id}`, { state: { adData: nextAd } });
      setTimeout(() => setIsAdLoading(false), 500);
    }
  };

  const handleRelatedAdClick = async (ad: Product, e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate(`/ads/${ad.id}`, { state: { adData: ad } });
    setTimeout(() => setIsAdLoading(false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrevious();
      touchStartX.current = null;
    }
  };


  // mini components
  const MobileHeader = () => (
    <div className="w-screen flex sm:hidden justify-between items-center px-2 py-3 bg-(--div-active) sticky top-0 z-50">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1">
        <img src="/arrowleft.svg" alt="Back" className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>
      <h2 className="text-sm font-medium some-gray] rounded-2xl py-1 px-2">
        {imageCount > 0 ? `${Math.min(galleryIndex + 1, imageCount)}/${imageCount}` : `0/0`}
      </h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <img src="/flag.svg" alt="" className="w-4 h-4" />
          <span className="text-xs">{String(reportCount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/favorited.svg" alt="" className="w-4 h-4" />
          <span className="text-xs">{favouriteCount}</span>
        </div>
        {multiplierLabel && (
          <div className="ml-2 text-white font-bold bg-green-500 rounded-lg px-3 py-1 text-sm">
            {multiplierLabel}
          </div>
        )}
      </div>
    </div>
  );
  const DesktopHeader = () => (
    <div className="hidden sm:flex bg-white p-2 lg:py-2 items-center justify-evenly gap-4 w-full font-light text-xs">
      <div className="flex items-center gap-2">
        <img
          src="/location.svg"
          alt=""
          className="w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base md:text-[1.125vw]">
          {currentAdData?.location?.name || "Unknown"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <img
          src="/star.svg"
          alt=""
          className="w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base  md:text-[1.125vw]">
          {reviewDeconstruction.count
            ? (reviewDeconstruction.sum / reviewDeconstruction.count).toFixed(1)
            : "0.0"}{" "}
          &nbsp;&nbsp;&nbsp;{reviewDeconstruction.count || "No"} Review
          {(reviewDeconstruction.count > 1 ||
            reviewDeconstruction.count === 0) &&
            "s"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/flag.svg"
          alt=""
          className="w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base md:text-[1.125vw]">{String(currentAdData?.total_reports)}</h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/favorited.svg"
          alt=""
          className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
        />
        <h2 className="text-base md:text-[1.125vw]">{favouriteCount}</h2>
      </div>
      {/* Image count (desktop) - mirrors mobile header */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">
          {imageCount > 0 ? `${Math.min(galleryIndex + 1, imageCount)}/${imageCount}` : `0/0`}
        </h2>
      </div>
      <div className="flex gap-2 ml-auto items-center">
        {multiplierLabel && (
          <div className="text-white font-bold bg-green-500 rounded-lg px-3 py-1 text-sm">
            {multiplierLabel}
          </div>
        )}
        <button
          onClick={handlePrevious}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <img
            src="/arrowleft.svg"
            alt=""
            className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
          />
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <img
            src="/arrowright.svg"
            alt=""
            className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
          />
        </button>
      </div>
    </div>
  );

  const ImageGallery = ({
    images,
    currentIndex,
    setCurrentIndex,
  }: {
    images: string[];
    currentIndex: number;
    setCurrentIndex: (n: number) => void;
  }) => {
    const galleryImages = images.length > 0 ? images : ["/no-image.jpeg"];
    const max = galleryImages.length;

    const maxStart = Math.max(0, max - 3);

    // Ensure the gallery window start index is always clamped so we show up to
    // three images. If external code sets the index to a value that would
    // produce fewer than three images at the left edge, move it left to the
    // last valid start so users can navigate back.
    useEffect(() => {
      if (currentIndex > maxStart) {
        setCurrentIndex(maxStart);
      }
    }, [currentIndex, maxStart, setCurrentIndex]);

    const prevImage = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex <= 0) return;
      setCurrentIndex(Math.max(0, currentIndex - 1));
    };

    const nextImage = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex >= maxStart) return;
      setCurrentIndex(Math.min(maxStart, currentIndex + 1));
    };

    const getMainImage = () => galleryImages[currentIndex] ?? "/no-image.jpeg";


    return (
      <div className="w-full flex justify-center my-4 sm:mb-8">

        {/* DESKTOP: show 3 side-by-side square images (carousel) */}
        <div className="hidden sm:flex w-full h-fit gap-4 items-stretch relative">
          {currentIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 bg-white rounded-full -translate-y-1/2 z-20 px-2 py-2 shadow"
              aria-label="Previous image"
            >
              <img src="/arrowleft.svg" alt="Previous" />
            </button>
          )}

          <div className="grid grid-cols-3 gap-4 w-full px-4 max-w-[95vw] mx-auto items-center">
            {galleryImages.slice(currentIndex, currentIndex + 3).map((src, i) => {
              const absIdx = currentIndex + i;
              return (
                <button
                  key={absIdx}
                  onClick={() => {
                    setCurrentIndex(absIdx);
                    setPictureModalIndex(absIdx);
                    setIsPictureModalOpen(true);
                  }}
                  className={`w-full aspect-square max-w-[30vw] rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center relative`}
                  aria-label={`Show image ${absIdx + 1}`}
                >
                  {/* Blurred background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                  {/* Main image on top */}
                  <img src={src} alt={`Image ${absIdx + 1}`} className="object-cover w-full h-full relative z-10" />
                </button>
              );
            })}
          </div>

          {currentIndex < maxStart && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 bg-white rounded-full -translate-y-1/2 z-20 px-2 py-2 shadow"
              aria-label="Next image"
            >
              <img src="/arrowright.svg" alt="Next" />
            </button>
          )}
        </div>

        {/* MOBILE: full-width swipeable image */}
        <div
          className="relative w-full max-w-3xl h-64 sm:h-96 overflow-hidden rounded-lg sm:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Blurred background image */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-md opacity-40"
            style={{ backgroundImage: `url(${getMainImage()})` }}
          />
          {/* Main image on top */}
          <img src={getMainImage()} alt="Ad main" className="object-contain w-full h-full cursor-zoom-in relative z-10" onClick={() => { setPictureModalIndex(galleryIndex); setIsPictureModalOpen(true); }} />
          <div onClick={handlePrevious} className="absolute top-0 left-0 w-[30%] h-full z-20" />
          <div onClick={handleNext} className="absolute top-0 right-0 w-[30%] h-full z-20" />
        </div>
      </div>
    );
  };


  const PictureModal = () => {
    if (!isPictureModalOpen) return null;
    const imgs = pageImages.length > 0 ? pageImages : ["/no-image.jpeg"];
    const max = imgs.length;

    const prev = (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      setPictureModalIndex((i) => Math.max(0, i - 1));
    };
    const next = (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      setPictureModalIndex((i) => Math.min(max - 1, i + 1));
    };

    const close = () => {
      setIsPictureModalOpen(false);
      // Clamp gallery start so closing the modal doesn't leave the gallery
      // showing a single image at the far right with no left navigation.
      const clampStart = Math.max(0, max - 3);
      setGalleryIndex(Math.max(0, Math.min(pictureModalIndex, clampStart)));
    };

    // keyboard handling is registered at top-level useEffect when modal is open

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={close}>
        <div
          className="relative max-w-4xl w-[95%] sm:w-[80%] bg-transparent p-4 max-h-[90vh] overflow-auto no-scrollbar flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-1 z-30 hover:bg-black/60 transition"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {max > 1 && pictureModalIndex > 0 && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 z-20 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prev(e);
              }}
              aria-label="Previous"
            >
              <img src="/arrowleft.svg" alt="Prev" />
            </button>
          )}

          <div className="relative flex items-center justify-center w-full">
            {/* Blurred background image */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-md opacity-40 rounded"
              style={{ backgroundImage: `url(${imgs[pictureModalIndex] ?? "/no-image.jpeg"})` }}
            />
            {/* Main image on top */}
            <img
              src={imgs[pictureModalIndex] ?? "/no-image.jpeg"}
              alt={`Modal image ${pictureModalIndex + 1}`}
              className="max-h-[60vh] sm:max-h-[70vh] object-contain w-full rounded relative z-10"
            />
          </div>

          {max > 1 && pictureModalIndex < max - 1 && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 z-20 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                next(e);
              }}
              aria-label="Next"
            >
              <img src="/arrowright.svg" alt="Next" />
            </button>
          )}

          <div className="mt-4 flex gap-2 overflow-hidden py-2 rounded justify-center items-center">
            {imgs.map((s, i) => (
              <button
                key={i}
                onClick={() => setPictureModalIndex(i)}
                className={`shrink-0 w-20 h-20 overflow-hidden rounded ${i === pictureModalIndex ? "ring-2 ring-white" : ""}`}
              >
                <img src={s} alt={`thumb ${i + 1}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TitleAndPrice = () => (
    <div className="bg-white px-4 sm:px-0 py-2 w-full text-left rounded-lg">
      <div className="flex items-center gap-2">
        <img src="/location.svg" alt="" className="w-3 h-3" />
        <h2 className="text-sm md:text-[1.1vw]">
          {currentAdData?.location?.name && currentAdData?.location?.region
            ? `${currentAdData?.location?.name}, ${currentAdData?.location?.region} Region`
            : "Unknown"}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl md:text-[2vw] font-medium">
          {currentAdData?.name || "Untitled Product"}
        </h2>
        {((currentAdData as any)?.is_taken || (currentAdDataFromQuery as any)?.is_taken) && (
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Taken</span>
        )}
      </div>
      <h2 className="text-xl font-medium md:text-[1.5vw]">
        {currentAdData?.price
          ? `${formatMoney(currentAdData?.price)}${currentAdData?.type?.toLowerCase() === 'rent' ? ' per month' : ''}`
          : "Please Contact the Seller for the Price of this Product"}
      </h2>
    </div>
  );
  const AdDetails = () => (
    <div className=" sm:p-6 md:pl-0">
      <h2 className="text-xl md:text-[1.75vw] font-bold mb-2">Ad Details</h2>
      <ul className="list-disc ml-5 md:ml-10 marker:text-black marker:font-extrabold space-y-2 text-sm md:text-[1.125vw]">
        <li>
          <span className="font-bold">Ad ID&nbsp;</span> {id}
        </li>
        {currentAdDataFromQuery?.product_features.map(
          (feat: ProductFeature) => (
            <li key={feat.id}>
              <span className="font-bold">{feat.feature.name}&nbsp;</span>
              <span>{feat.value}</span>
            </li>
          ),
        )}
        {currentAdData?.location?.name && (
          <li>
            <span className="font-bold">Location&nbsp;</span>{" "}
            {currentAdData?.location?.name}
          </li>
        )}
      </ul>
    </div>
  );
  const SafetyTips = () => (
    <div className="bg-white sm:bg-(--div-active) sm:p-6 rounded-2xl py-1 px-2 pb-5 lg:mx-6">
      <h2 className="text-xl font-bold mb-2 md:text-[1.75vw]">Safety tips</h2>
      <p className="text-gray-500 mb-3 py-1 px-2 rounded-2xl text-xs bg-(--div-active) sm:bg-white md:text-[0.9vw]">
        Follow this tips and report any suspicious activity.
      </p>
      <ul className="list-disc ml-5 marker:text-black space-y-2 font-bold text-sm md:text-[1.125vw]">
        <li>Meet in a public place</li>
        <li>Check the vehicle history</li>
        <li>Inspect the vehicle thoroughly</li>
        <li>Don't share personal information</li>
        <li>Trust your instincts</li>
      </ul>
    </div>
  );

  const ActionButtons = ({
    onMarkTaken = () => { },
    onReportAd = () => { },
    onCaller1 = () => { },
    onCaller2 = () => { },
    onMakeOffer = () => { },
    onFavorite = () => { },
    isFavourited = false,
    // new props for caller UI
    caller1,
    caller2,
    showCaller1: showC1,
    showCaller2: showC2,
    toggleCaller1,
    toggleCaller2,
    favouritePending = false,
  }: {
    onMarkTaken?: () => void;
    onReportAd?: () => void;
    onCaller1?: () => void;
    onCaller2?: () => void;
    onMakeOffer?: () => void;
    onFavorite?: () => void;
    isFavourited?: boolean;
    caller1?: string | null;
    caller2?: string | null;
    showCaller1?: boolean;
    showCaller2?: boolean;
    toggleCaller1?: () => void;
    toggleCaller2?: () => void;
    favouritePending?: boolean;
  }) => {
    const isTaken = Boolean((currentAdData as any)?.is_taken || (currentAdDataFromQuery as any)?.is_taken);
    const [showOffer, setShowOffer] = useState(false);
    const [offerInput, setOfferInput] = useState<string>("");
    const actions: Record<string, () => void> = {
      "Mark as taken": isTaken ? () => { } : (onMarkTaken || (() => { })),
      "Report Ad": onReportAd,
      "Caller 1": onCaller1,
      "Caller 2": onCaller2,
      "Make Offer": onMakeOffer,
      Favorites: onFavorite,
    };

    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-1">
          {(() => {
            const items: Array<[string, string]> = [
              ["mark as taken.svg", "Mark as taken"],
              ["flag.svg", "Report Ad"],
              ["outgoing call.svg", "Caller 1"],
              // only include Caller 2 when a second number is available
              ...(caller2 ? ([["outgoing call.svg", "Caller 2"]] as [string, string][]) : []),
              ["Make an offer.svg", "Make Offer"],
              ["favorited.svg", "Favorites"],
            ];
            return items.map(([icon, label]) => (
              <div key={label} className="relative inline-block">
                <button
                  key={label}
                  className={`flex items-center gap-2 p-4 h-5 rounded-lg text-sm md:text-[1.125vw] bg-(--div-active) transition sm:bg-white hover:bg-gray-50
                  ${actions[label]
                      ? "cursor-pointer hover:scale-95 active:scale-105"
                      : "cursor-not-allowed"
                    }
                `}
                  onClick={(e) => {
                    e.stopPropagation();
                    // special handling for caller buttons to toggle tooltip
                    if (label === "Caller 1") {
                      (toggleCaller1 || (() => { }))();
                      return;
                    }
                    if (label === "Caller 2") {
                      (toggleCaller2 || (() => { }))();
                      return;
                    }
                    if (label === "Make Offer") {
                      setShowOffer((s) => !s);
                      return;
                    }
                    // otherwise perform action
                    // disable Favorites button when mutation is pending
                    if (label === "Favorites" && favouritePending) return;
                    actions[label]();
                  }}
                  disabled={label === "Favorites" && favouritePending}
                >
                  {/* favourite button shows toggled state */}
                  {label === "Favorites" ? (
                    <>
                      <img
                        src={isFavourited ? "/favorited.svg" : "/heart-outline.svg"}
                        alt=""
                        className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]"
                      />
                      <p className="whitespace-nowrap">{isFavourited ? "Liked" : "Like"}</p>
                    </>
                  ) : (
                    <>
                      {/* show Taken label instead of Mark as taken when product is already taken */}
                      {label === "Mark as taken" && isTaken ? (
                        <>
                          <img src="/check.svg" alt="" className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]" />
                          <p className="whitespace-nowrap">Taken</p>
                        </>
                      ) : (
                        <>
                          <img
                            src={`/${icon}`}
                            alt=""
                            className="w-4 h-4 md:h-[1.125vw] md:w-[1.125vw]"
                          />
                          <p className="whitespace-nowrap">{label}</p>
                        </>
                      )}
                    </>
                  )}
                </button>

                {/* caller tooltip */}
                {label === "Caller 1" && (showC1 && caller1) && (
                  <div className="absolute z-50 mt-2 p-3 bg-white rounded-2xl shadow-md text-sm w-64 h-30 sm:h-30 overflow-auto left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0 sm:w-72">
                    <div className="flex flex-col items-center gap-8">
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <img src="/outgoing call.svg" alt="" className="w-4 h-auto" />
                        <span className="text-[9px]">Caller 1</span>
                      </div>
                      <a
                        href={`tel:${caller1}`}
                        onClick={(ev) => ev.stopPropagation()}
                        className="font-normal flex items-center gap-2"
                        style={{ color: "var(--dark-def)", textDecoration: "none" }}
                      >
                        <span className="border border-gray-200 px-2 py-1">Call</span><span className="border border-gray-200 px-2 py-1"> {caller1}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Make Offer modal */}
                {label === "Make Offer" && showOffer && (
                  <div className="absolute z-50 mt-2 p-4 bg-white rounded-2xl shadow-md text-sm w-80 h-50 sm:h-54 overflow-auto left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0 sm:w-96">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <img src="/Make an offer.svg" alt="" className="w-4 h-auto" />
                        <span className="text-[9px]">Make Offer</span>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        {/* offer option buttons: no border */}
                        <div className="flex gap-2">
                          {['~5% cut', '~10% cut', '~15% cut', '~20% cut'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className="w-full text-center py-2 rounded bg-(--div-active) text-[10px] text-(--dark-def) font-medium focus:outline-none"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                // set the input value when an option is clicked
                                setOfferInput(`${opt} off on overall price`);
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {/* input + send button */}
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={offerInput}
                            onChange={(e) => setOfferInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded bg-white border border-gray-200 text-sm"
                            onClick={(ev) => ev.stopPropagation()}
                          />
                          <button
                            type="button"
                            className="border border-gray-200 px-1 rounded bg-(--div-active) text-(--dark-def) font-medium"
                            onClick={async (ev) => {
                              ev.stopPropagation();
                              if (!offerInput || offerInput.trim().length === 0) return;
                              // send offer as chat message and open inbox
                              await openChatWithOwnerAndSend(offerInput.trim());
                              setShowOffer(false);
                            }}
                          >
                            <img src="/send.svg" alt="Send" className="w-8 h-8" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {label === "Caller 2" && (showC2 && caller2) && (
                  <div className="absolute z-50 mt-2 p-3 bg-white border rounded-2xl shadow-md text-sm w-64 h-30 sm:h-30 overflow-auto left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0 sm:w-72">
                    <div className="flex flex-col items-center gap-3">
                      <img src="/outgoing call.svg" alt="" className="w-4 h-auto" />
                      <span className="text-[9px]">Caller 2</span>
                      <a
                        href={`tel:${caller2}`}
                        onClick={(ev) => ev.stopPropagation()}
                        className="font-normal flex items-center gap-2"
                        style={{ color: "var(--dark-def)", textDecoration: "none" }}
                      >
                        <span className="border border-gray-200 px-2 py-1">Call</span><span className="border border-gray-200 px-2 py-1"> {caller2}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ));
          })()}
        </div>
      </div>
    );
  };

  const CommentsSection = () => {
    return (
      <div className="p-6 w-full rounded-lg -ml-4 sm:ml-0 lg:p-0">
        <h2 className="text-2xl font-medium sm:hidden inline">
          Seller Reviews
        </h2>
        <h2 className="text-2xl font-medium hidden sm:inline md:text-[1.7vw]">
          Comments
        </h2>
        <div className="mt-5 -ml-4 w-[120%] sm:w-full flex flex-col gap-3">
          {productReviews.length === 0 && (
            <p className="text-[1.2vw]">
              No <span className="max-sm:hidden">comments</span>
              <span className="sm:hidden">reviews</span> to show. Leave one?
            </p>
          )}
          {productReviews.slice(0, 3).map((review: Review) => (
            <div
              key={review.id}
              className="p-4 last:border-b-0 bg-(--div-active) rounded-lg w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user.avatar || "/userPfp2.jpg"}
                    alt=""
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="flex flex-col">
                    <p className="text-[10px] text-gray-500 md:text-[0.9vw]">
                      {formatReviewDate(review.created_at)}
                    </p>
                    <h3 className="font-semibold md:text-[1.2vw]">
                      {review.user.name || "User"}
                    </h3>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <p
                          key={i}
                          className={`inline-flex justify-center items-center w-3 h-3 md:w-[1.2vw] md:h-[1.2vw]  
                          ${i < review.rating ? "text-gray-700" : "text-gray-300"}`}
                        >
                          ★
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (likeMutation.isPending) return;
                      setAnimatingLikes((prev) => new Set(prev).add(review.id));
                      setTimeout(() => {
                        setAnimatingLikes((prev) => {
                          const next = new Set(prev);
                          next.delete(review.id);
                          return next;
                        });
                      }, 600);
                      likeMutation.mutate({ id: review.id });
                    }}
                    className="flex items-center gap-1 m-2 md:text-[1vw]"
                    aria-label={review.liked ? "Unlike review" : "Like review"}
                  >
                    <img
                      src="/like.svg"
                      alt=""
                      className={`w-5 h-5 md:h-[1.2vw] md:w-[1.2vw] transition-opacity ${animatingLikes.has(review.id) ? "animate-like-heartbeat" : ""
                        } ${review.liked ? "opacity-100" : "opacity-60"}`}
                    />
                    <h3>Like</h3>
                  </button>
                  <span className="text-sm md:text-[1vw]">{review.likes_count ?? 0}</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm md:text-[1.123vw] md:mt-3">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 items-center justify-center md:text-[1.2vw]">
          <button
            onClick={() => navigate("/reviews", { state: { productId: currentAdData?.id ?? numericId } })}
            className="bg-(--div-active) text-(--dark-def) px-6 py-3 rounded-full whitespace-nowrap hover:scale-95 active:105 cursor-pointer hover:bg-gray-100 transition"
          >
            Make Review
          </button>
          <button
            onClick={() => navigate("/reviews", { state: { productId: currentAdData?.id ?? numericId } })}
            className="text-(--dark-def) px-6 py-3 rounded-full bg-(--div-active) whitespace-nowrap hover:scale-95 active:105 cursor-pointer hover:bg-gray-100 transition"
          >
            Show reviews
          </button>
        </div>
      </div>
    );
  };
  const QuickChat = () => (
    <div className="w-full">
      <div className="pt-4 w-full">
        <div className="flex items-center gap-2 mb-3">
          <img src="/quick chat.svg" alt="" className="w-5 h-5" />
          <h6 className="font-semibold text-xs md:text-[1vw]">Quick Chat</h6>
        </div>
        <div className="flex flex-wrap flex-row gap-2 mb-4 w-full text-gray-400 sm:text-(--dark-def) font-extralight justify-start">
          {[
            "Is this Original?",
            "Do you have delivery options?",
            "What is the warranty period?",
            "Can I see the service history?",
          ].map((text, i) => (
            <button
              key={i}
              className="px-3 py-2 bg-(--div-active) sm:bg-white rounded text-xs md:text-[0.9vw] hover:bg-gray-100 whitespace-nowrap w-fit"
            >
              {text}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Start a chat"
            value={quickChatInput}
            onChange={(e) => setQuickChatInput(e.target.value)}
            style={{ border: "1px solid var(--div-border)" }}
            className="rounded-2xl px-3 py-3 bg-no-repeat sm:bg-white text-sm md:text-[1.125vw] w-full sm:border-(--dark-def)"
          />
          <button
            style={{ border: "1px solid var(--div-border)" }}
            className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white"
            onClick={async () => {
              if (!quickChatInput || quickChatInput.trim().length === 0) return;
              await openChatWithOwnerAndSend(quickChatInput.trim());
              setQuickChatInput("");
            }}
          >
            <img
              src="/send.svg"
              alt="Send"
              className="w-6 h-6"
            />
          </button>
        </div>
        <div className="mt-4 space-y-2 text-[10px] inline-flex flex-wrap gap-2 text-gray-600">
          <div className="flex items-center justify-end relative">
            <h4 className="bg-(--green) h-fit p-0 pl-1 pr-8 rounded-2xl md:text-[0.8vw]">
              Chat is secured
            </h4>
            <img
              src="/lock-on-svgrepo-com.svg"
              alt=""
              className="bg-(--green) z-10 rounded-full w-6 h-6 p-1 absolute"
            />
          </div>
          <div className="flex -mt-2 items-center gap-1 md:text-[0.8vw]">
            <img
              src="/shield.svg"
              alt=""
              className="w-3 h-3 md:w-[0.9vw] md:h-[0.9vw]"
            />
            <h4>Always chat here for Safety reasons!</h4>
          </div>
        </div>
      </div>
    </div>
  );
  const SellerInfo = () => (
    <div className="sm:mt-4">
      {/* profile bit pc */}
      <div className="hidden sm:flex flex-row gap-4 bg-(--div-active) px-4 py-7 rounded-2xl mb-5">
        <div className="relative">
          <img
            src={owner?.avatar || "/userPfp2.jpg"}
            alt={owner?.name || "Seller"}
            className="w-15 h-15 md:w-[5vw] md:h-[5vw] rounded-full"
          />
          {owner?.admin_verified && (
            <img
              src="/verified.svg"
              alt="Verified"
              className="absolute -bottom-1 -right-2 w-8 h-8 md:w-[3vw] md:h-[3vw]"
            />
          )}
        </div>
        <div>
          <h2 className="text-sm text-gray-500 md:text-[1vw]">
            {currentAdData?.created_at ? new Date(currentAdData.created_at).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : ""}
          </h2>
          <h3 className="font-semibold md:text-[1.2vw]">{owner?.name ?? "Seller"}</h3>
          <h3 className="text-sm text-gray-600 md:text-[1vw]">Total Ads: {sellerProducts.length}</h3>
        </div>
      </div>
      {/* store name */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-2 flex-col">
          <h4 className="text-xl md:text-[1.5vw]">{currentAdData?.owner?.name ?? "Seller"}</h4>
          <div className="flex bg-green-300 px-1 p-0.5 rounded items-center gap-1">
            <img src="/tick.svg" alt="" className="w-3 h-3" />
            <span className="text-[10px] md:text-[0.9vw] text-green-800">
              {(() => {
                // prefer level from product owner if available (use owner only)
                const ownerLevel = (owner as unknown as { level?: string })?.level as string | undefined;
                if (ownerLevel) return ownerLevel;
                return "High level";
              })()}
            </span>
          </div>
        </div>
        <button className="px-2 py-1 rounded text-sm md:text-[1vw] bg-(--div-active)">
          Seller Ads
        </button>
      </div>

      {/* product slideshow (keeps static visuals) */}
      <div className="flex items-center justify-center mb-4 w-full">
        <div className="pt-4 overflow-x-hidden w-full">
          <div className="relative flex items-center justify-center gap-2 w-full">
            <button className="absolute left-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300">
              <img src="/arrowleft.svg" alt="" className="w-4 h-4" />
            </button>
            <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar">
              {sellerProducts && sellerProducts.length > 0 ? (
                sellerProducts.slice(0, 6).map((p) => (
                  <img
                    key={p.id}
                    src={p.image || "/no-image.jpeg"}
                    alt={p.name || "Seller product"}
                    role="button"
                    tabIndex={0}
                    onClick={async () => {
                      setIsAdLoading(true);
                      await new Promise(resolve => setTimeout(resolve, 100));
                      navigate(`/ads/${p.id}`, { state: { adData: p } });
                      setTimeout(() => setIsAdLoading(false), 500);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setIsAdLoading(true);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        navigate(`/ads/${p.id}`, { state: { adData: p } });
                        setTimeout(() => setIsAdLoading(false), 500);
                      }
                    }}
                    className="bg-(--div-active) w-23 h-23 object-cover rounded shrink-0 cursor-pointer"
                  />
                ))
              ) : (
                <>
                  <p className="text-gray-500 md:text-[1vw] w-full text-center">No other ads from this seller.</p>
                </>
              )}
            </div>
            <button className="absolute right-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300">
              <img src="/arrowright.svg" alt="" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* profile bit mobile*/}
      <div className="sm:hidden flex flex-row gap-4 bg-(--div-active) p-4 rounded-2xl mb-5">
        <div className="relative">
          <img src={currentAdData?.owner?.avatar || "/userPfp2.jpg"} alt="" className="w-15 h-15 rounded-full" />
          {(currentAdData?.owner?.is_verified || currentAdData?.owner?.verified || currentAdData?.owner?.verified_at) && (
            <img src="/verified.svg" alt="Verified" className="absolute -bottom-1 -right-2 w-8 h-8" />
          )}
        </div>
        <div>
          <h2 className="text-sm text-gray-500">{currentAdData?.created_at ? new Date(currentAdData.created_at).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : ""}</h2>
          <h3 className="font-semibold">{currentAdData?.owner?.name ?? "Seller"}</h3>
          <h3 className="text-sm text-gray-600">Total Ads: {ads.filter(a => a.owner?.id === currentAdData?.owner?.id).length || 0}</h3>
        </div>
      </div>
    </div>
  );
  const SimilarAds = () => (
    <div className="bg-white sm:bg-(--div-active) max-sm:p-4 sm:py-6 w-screen md:px-12">
      <h2 className="text-xl font-bold mb-6 px-2 md:px-20 lg:text-2xl">
        Similar Ads
      </h2>

      <div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-center ">
        {(relatedProducts && relatedProducts.length > 0 ? relatedProducts : ads).map((ad) => 
          ad.is_taken && (
          <Link
            key={ad.id}
            to={`/ads/${ad.id}`}
            state={{ adData: ad }}
            onClick={(e) => handleRelatedAdClick(ad, e)}
            className="inline-block rounded-2xl overflow-hidden shrink-0 w-[38vw] sm:w-48 md:w-52"
          >
            <img
              src={ad.image || "/no-image.jpeg"}
              alt={ad.name.slice(0, 10)}
              className="w-full h-[120px] sm:h-48 object-cover rounded-2xl"
            />
            <div className="flex items-center gap-1 px-2 py-1">
              <img
                src="/location.svg"
                alt=""
                className="w-3 sm:w-4 h-3 sm:h-4 md:h-[1.2vw] md:w-[1.2vw]"
              />
              <p className="text-[10px] sm:text-xs md:text-[0.9vw] text-gray-500 truncate">
                {ad.location?.name || "Unknown"}
              </p>
            </div>
            <p className="px-2 text-[11px] sm:text-sm md:text-[1.2vw] line-clamp-1 text-gray-600">
              {ad.name}
            </p>
            <p className="px-2 text-[11px] sm:text-sm md:text-[1.125vw] font-medium text-gray-800">
              {formatMoney(ad.price, "GHS")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="lg:pt-5">
      <AdLoadingOverlay isVisible={isAdLoading || adLoading || adsLoading} />
      <div
        style={{ color: "var(--dark-def)" }}
        className="flex flex-col items-center w-[calc(100%-0.2rem)] sm:w-full min-h-screen px-4 sm:px-12 gap-6 overflow-x-hidden bg-(--div-active) sm:bg-white"
      >
        <MobileHeader />

        <div className="w-full md:p-6">
          <DesktopHeader />
          <ImageGallery images={pageImages} currentIndex={galleryIndex} setCurrentIndex={setGalleryIndex} />
          <PictureModal />
          <TitleAndPrice />

          {/* MAIN CONTENT */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-evenly gap-4 flex-col md:px-4 lg:px-0 ad-details-page">

              {/* mobile layout */}
              <div className="sm:hidden flex w-full justify-between ad-details-page">
                <div className="flex flex-col space-y-6 w-fit md:w-1/2 mb-6 md:min-h-[250px] pt-7">
                  <AdDetails />
                </div>
                <div className="flex flex-col space-y-6 w-full md:w-1/2 pt-10">
                  <SafetyTips />
                </div>
              </div>
              <div className="sm:hidden flex w-full ad-details-page">
                <div className="flex flex-col w-fit space-y-6 md:w-1/2  bg-white p-6 rounded-lg mb-5">
                  <ActionButtons
                    onMarkTaken={handleMarkAsTaken}
                    onFavorite={handleToggleFavourite}
                    onReportAd={handleReportAd}
                    isFavourited={isFavourited}
                    favouritePending={toggleFavourite.status === "pending"}
                    caller1={callerNumber1}
                    caller2={callerNumber2}
                    showCaller1={showCaller1}
                    showCaller2={showCaller2}
                    toggleCaller1={toggleCaller1}
                    toggleCaller2={toggleCaller2}
                  />
                  <QuickChat />
                </div>
                <div className="bg-white p-6 rounded-lg w-full">
                  <SellerInfo />
                  <div className="hidden md:block">
                    <RatingReviews layout="row" />
                  </div>
                  <div className="md:hidden">
                    <RatingReviews fullWidth rd={reviewDeconstruction} />
                  </div>
                </div>

                <div className="bg-white mt-6 p-6 rounded-lg w-full">
                  <CommentsSection />
                </div>
              </div>

              {/* desktop layout */}
              <div className="hidden sm:flex w-full justify-between ad-details-page">
                <div className="flex flex-col space-y-6 w-fit md:w-1/2 mb-6 md:min-h-[250px]">
                  <AdDetails />
                  <div className="flex flex-col w-full space-y-6 p-6 lg:p-0 mb-5">
                    <RatingReviews layout="row" rd={reviewDeconstruction} />
                    <CommentsSection />
                  </div>
                </div>
                <div className="flex flex-col space-y-6 w-full md:w-1/2">
                  <SafetyTips />
                  <div className="p-6 rounded-lg w-full">
                    <div className="sm:bg-(--div-active) w-full p-3 rounded-2xl">
                      <ActionButtons
                        onMarkTaken={handleMarkAsTaken}
                        onFavorite={handleToggleFavourite}
                        onReportAd={handleReportAd}
                        isFavourited={isFavourited}
                        favouritePending={toggleFavourite.status === "pending"}
                        caller1={callerNumber1}
                        caller2={callerNumber2}
                        showCaller1={showCaller1}
                        showCaller2={showCaller2}
                        toggleCaller1={toggleCaller1}
                        toggleCaller2={toggleCaller2}
                      />
                      <QuickChat />
                    </div>
                    <SellerInfo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen p-0 lg:mt-15">
        <SimilarAds />
        <div className="p-8 sm:p-10 bg-(--div-active)" />
      </div>
      <MenuButton />
    </div>
  );
};

export default AdsDetailsPage;
