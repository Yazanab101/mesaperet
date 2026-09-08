import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { ROUTES } from "./data/site";

const HomePage = lazy(() =>
  import("./pages/Home/Home").then((m) => ({ default: m.HomePage })),
);
const AboutPage = lazy(() =>
  import("./pages/About/About").then((m) => ({ default: m.AboutPage })),
);
const WorkshopsPage = lazy(() =>
  import("./pages/Workshops/Workshops").then((m) => ({ default: m.WorkshopsPage })),
);
const ConsultationPage = lazy(() =>
  import("./pages/Consultation/Consultation").then((m) => ({ default: m.ConsultationPage })),
);
const GiftPage = lazy(() =>
  import("./pages/Gift/Gift").then((m) => ({ default: m.GiftPage })),
);
const TestimonialsPage = lazy(() =>
  import("./pages/Testimonials/Testimonials").then((m) => ({ default: m.TestimonialsPage })),
);
const ContactPage = lazy(() =>
  import("./pages/Contact/Contact").then((m) => ({ default: m.ContactPage })),
);
const AccessibilityPage = lazy(() =>
  import("./pages/Accessibility/Accessibility").then((m) => ({ default: m.AccessibilityPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/Privacy/Privacy").then((m) => ({ default: m.PrivacyPage })),
);

function PageFallback() {
  return (
    <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
      טוען...
    </div>
  );
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.about} element={<AboutPage />} />
            <Route path={ROUTES.workshops} element={<WorkshopsPage />} />
            <Route path={ROUTES.consultation} element={<ConsultationPage />} />
            <Route path={ROUTES.gift} element={<GiftPage />} />
            <Route path={ROUTES.testimonials} element={<TestimonialsPage />} />
            <Route path={ROUTES.contact} element={<ContactPage />} />
            <Route path={ROUTES.accessibility} element={<AccessibilityPage />} />
            <Route path={ROUTES.privacy} element={<PrivacyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
