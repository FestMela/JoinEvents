# Requirements Document

## Introduction

This document defines requirements for seven platform enhancements to the JoinEvents Angular 20 event management application. JoinEvents is a multi-role platform serving Customers, Vendors, Admins, and Support staff for booking and managing events across India. The enhancements cover: Advanced Search & Filtering, Notification System, Analytics Dashboard, Mobile Responsiveness, Testing Suite, Performance Optimization, and Accessibility Compliance.

---

## Glossary

- **Platform**: The JoinEvents Angular 20 standalone-component web application.
- **Customer**: An authenticated user with the `customer` role who browses and books event packages.
- **Vendor**: An authenticated user with the `vendor` role who offers event services and manages bookings.
- **Admin**: An authenticated user with the `admin` role who manages the platform, users, and bookings.
- **Support**: An authenticated user with the `support` role who handles tickets, verifications, and reviews.
- **Search_Service**: The Angular service responsible for filtering and ranking vendor/package results.
- **Notification_Service**: The Angular service responsible for creating, storing, and delivering in-app notifications.
- **Analytics_Service**: The Angular service responsible for aggregating and exposing business intelligence data.
- **Package**: An event offering composed of a venue, services, and pricing, listed in `MockApiService.getPackages()`.
- **Vendor_Service**: A discrete service offering listed by a vendor in `MockApiService.getVendorServices()`.
- **Booking**: A confirmed or pending event reservation tracked in `MockApiService.getBookings()`.
- **Toast_Service**: The existing `ToastService` used for in-app transient messages.
- **MockApiService**: The existing Angular service that provides all data via RxJS Observables and Angular Signals.
- **AuthService**: The existing Angular service that manages session state via Angular Signals.
- **WCAG_2_1_AA**: Web Content Accessibility Guidelines version 2.1, Level AA conformance standard.
- **Lazy_Route**: An Angular route configured with `loadComponent` for deferred loading.
- **Signal**: An Angular reactive primitive (`signal()`) used for state management throughout the Platform.
- **KPI**: Key Performance Indicator — a quantifiable metric displayed on dashboards.
- **RFP**: Request for Proposal — a customer-initiated request sent to multiple vendors.
- **TTL**: Time-to-live — the duration in seconds for which a cached HTTP response remains valid.
- **BookingStatus**: One of the following string literals: `pending`, `advance_paid`, `confirmed`, `in_progress`, `settled`, `cancelled`.

---

## Requirements

---

### Requirement 1: Advanced Search & Filtering

**User Story:** As a Customer, I want to filter vendors and packages by category, price range, location, rating, and availability, so that I can quickly discover offerings that match my event needs.

#### Acceptance Criteria

1. THE Search_Service SHALL expose a filter interface accepting the following optional parameters: `category` (string), `minPrice` (number ≥ 0), `maxPrice` (number ≥ 0), `location` (string), `minRating` (number, 0–5 inclusive), `availableDate` (ISO 8601 date string), and `query` (free-text string).
2. WHEN a Customer applies one or more filters and a text query simultaneously, THE Search_Service SHALL return only records that satisfy all supplied filter conditions AND match the text query, applying both constraints with AND logic.
3. WHEN a Customer applies one or more filters on the packages page, THE Search_Service SHALL return only Package records where all supplied filter conditions are simultaneously satisfied.
4. WHEN a Customer applies one or more filters on the vendors page, THE Search_Service SHALL return only Vendor_Service records where all supplied filter conditions are simultaneously satisfied.
5. WHEN a Customer enters a text query in the search input, THE Search_Service SHALL match the query case-insensitively against the package name, vendor name, location, and service category fields.
6. WHEN no filter parameters are supplied, THE Search_Service SHALL return the complete unfiltered dataset.
7. WHEN a Customer selects a price range filter where `minPrice` is greater than `maxPrice`, THE Platform SHALL display a validation error message and SHALL NOT apply the invalid filter.
8. WHEN a Customer selects a price range filter with a valid range, THE Platform SHALL display only results with a price value between `minPrice` and `maxPrice` inclusive.
9. WHEN a Customer selects a minimum rating filter, THE Platform SHALL display only results with a `rating` value greater than or equal to the selected minimum.
10. WHEN a Customer clears all active filters, THE Platform SHALL restore the full unfiltered result set within 300 milliseconds.
11. THE Platform SHALL display the count of active filters and the total number of matching results on the filter panel.
12. WHEN the filter result set is empty, THE Platform SHALL display an empty-state message that includes the text "No results found" and a prompt to adjust or clear the filters.
13. WHERE the `availableDate` filter is applied, THE Search_Service SHALL exclude Vendor_Service records whose vendor calendar marks that date as `booked` or `blocked`.
14. THE Search_Service SHALL preserve filter state in Angular Signals so that navigating away and returning to the search page restores the previously applied filters without requiring the user to re-enter them.

---

### Requirement 2: Notification System

**User Story:** As a Platform user (Customer, Vendor, Admin, or Support), I want to receive in-app notifications and email alerts for booking updates, messages, and payment events, so that I stay informed without manually checking each section.

#### Acceptance Criteria

1. THE Notification_Service SHALL maintain a Signal-based list of notifications per authenticated user, each containing: `id` (string), `title` (string), `message` (string), `type` (one of `booking`, `message`, `payment`, `verification`, `system`), `isRead` (boolean, default `false`), `createdAt` (ISO 8601 timestamp), and `targetRole` (one of `customer`, `vendor`, `admin`, `support`).
2. WHEN a Booking status transitions from `pending` to `confirmed`, from `pending` to `cancelled`, from `confirmed` to `cancelled`, or from `confirmed` to `completed`, THE Notification_Service SHALL create a notification of type `booking` for the affected Customer and, where an assigned Vendor exists, for that Vendor.
3. WHEN a new ChatMessage is sent in a thread, THE Notification_Service SHALL create a notification of type `message` for each thread participant whose `id` does not match the `senderId` of the new message.
4. WHEN an advance payment is recorded for a Booking, THE Notification_Service SHALL create a notification of type `payment` for the Customer associated with that Booking and for all users with the `admin` role.
5. WHEN a Vendor's verification status changes to any value, THE Notification_Service SHALL create a notification of type `verification` for that Vendor.
6. WHEN an authenticated user views the notifications page, THE Platform SHALL display all notifications whose `targetRole` matches the authenticated user's role, sorted by `createdAt` descending.
7. WHEN an authenticated user marks a single notification as read, THE Notification_Service SHALL set `isRead` to `true` for that notification and decrement the unread count Signal by one.
8. WHEN an authenticated user selects "Mark all as read", THE Notification_Service SHALL set `isRead` to `true` for all notifications belonging to the authenticated user and set the unread count Signal to zero.
9. THE Platform SHALL display the unread notification count as a badge on the notifications navigation link for all portal layouts (Customer, Vendor, Admin).
10. WHEN the unread notification count is zero, THE Platform SHALL not render the badge element on the notifications navigation link.
11. IF a notification is created while no user is authenticated, THEN THE Notification_Service SHALL store the notification in sessionStorage keyed by the target user's ID so that it is available when that user next authenticates in the same browser session.
12. THE Notification_Service SHALL support email alert simulation by logging a structured object to the browser console — containing `recipient` (email string), `subject` (string), and `body` (string) — when a notification of type `booking` or `payment` is created.

---

### Requirement 3: Analytics Dashboard

**User Story:** As an Admin or Vendor, I want to view business intelligence charts and KPI metrics, so that I can monitor revenue trends, booking performance, and platform health.

#### Acceptance Criteria

1. THE Analytics_Service SHALL expose a `getAdminAnalytics()` method returning an Observable that emits an object containing: `totalRevenue` (number), `monthlyRevenue` (number[12], indexed 0=January to 11=December for the current calendar year, defaulting to 0 for months with no data), `bookingCountByStatus` (a map of all BookingStatus values to their counts, with 0 for statuses with no bookings), `top5VendorsByEarnings` (array of up to 5 vendor objects sorted by `totalEarnings` descending), `customerAcquisitionByMonth` (number[12] for the current calendar year), and `averageBookingValue` (number).
2. THE Analytics_Service SHALL expose a `getVendorAnalytics(vendorId: string)` method returning an Observable that emits an object containing: `totalEarnings` (number), `monthlyEarnings` (number[12] for the current calendar year, defaulting to 0), `bookingCountByStatus` (map of all BookingStatus values to counts), `averageRatingTrend` (number[12] for the current calendar year, defaulting to 0), and `topPerformingService` (the Vendor_Service object with the highest revenue for that vendor; if two services tie, the one with the lower alphabetical `name` is returned).
3. WHEN an Admin navigates to the admin analytics route, THE Platform SHALL render a dashboard displaying all KPIs from `getAdminAnalytics()` using chart components built with native SVG or Bootstrap 5 utilities.
4. WHEN a Vendor navigates to the vendor analytics route, THE Platform SHALL render a dashboard displaying all KPIs from `getVendorAnalytics()` for the authenticated vendor's ID.
5. THE Platform SHALL display monthly revenue as a bar chart with exactly 12 data points, one per calendar month, with a labeled x-axis showing month abbreviations and a labeled y-axis showing currency values in INR.
6. THE Platform SHALL display booking status distribution as a doughnut or pie chart with a legend that labels each BookingStatus category and its count.
7. WHEN an Admin selects a date range filter (start date and end date) on the analytics dashboard, THE Analytics_Service SHALL return data scoped to Bookings whose `eventDate` falls within the selected range inclusive; IF the start date is after the end date, THE Platform SHALL display a validation error and SHALL NOT apply the filter.
8. THE Platform SHALL display each KPI card with a label, the current period value, and a percentage change indicator relative to the immediately preceding calendar month; IF the preceding month value is zero, THE Platform SHALL display "N/A" instead of a percentage.
9. WHEN analytics data is loading, THE Platform SHALL display skeleton loader placeholders in place of chart and KPI components until the data Observable emits.
10. THE Analytics_Service SHALL derive all analytics data from the existing MockApiService data (bookings, vendors, customers) without introducing external data sources or HTTP calls.
11. WHERE a Vendor's analytics show zero completed bookings, THE Platform SHALL display a zero-state message that includes the text "No completed bookings yet" and a call-to-action link to the vendor's profile page.
12. WHEN the `getAdminAnalytics()` or `getVendorAnalytics()` Observable errors, THE Platform SHALL display an error message and a retry button that re-invokes the analytics method.

---

### Requirement 4: Mobile Responsiveness

**User Story:** As a mobile device user, I want all portal pages to render correctly on screens 320px–767px wide, so that I can use the Platform on a smartphone without horizontal scrolling or broken layouts.

#### Acceptance Criteria

1. THE Platform SHALL render all Customer portal pages without horizontal overflow on viewport widths between 320px and 767px inclusive.
2. THE Platform SHALL render all Vendor portal pages without horizontal overflow on viewport widths between 320px and 767px inclusive.
3. THE Platform SHALL render all Admin portal pages without horizontal overflow on viewport widths between 320px and 767px inclusive.
4. THE Platform SHALL render all Support portal pages without horizontal overflow on viewport widths between 320px and 767px inclusive.
5. WHEN the viewport width is less than 768px, THE Platform SHALL collapse the sidebar navigation into a hamburger-triggered off-canvas menu for all portal layouts.
6. WHEN the viewport width is less than 768px, THE Platform SHALL display data tables as card-based stacked layouts where each table row is rendered as an individual card with label–value pairs arranged vertically, one pair per line.
7. WHEN the viewport width is less than 768px, THE Platform SHALL display KPI cards in a single-column grid (one card per row).
8. WHEN the viewport width is less than 768px, THE Platform SHALL display form fields at full width (100%) within their container.
9. THE Platform SHALL use Bootstrap 5 responsive grid classes (`col-12`, `col-md-*`, `col-lg-*`) for all layout containers to achieve responsive behavior.
10. WHEN the viewport width is less than 768px, THE Platform SHALL respond to a left-to-right swipe gesture to open the off-canvas navigation menu and a right-to-left swipe gesture to close it.
11. THE Platform SHALL ensure that all page content and interactive controls are fully readable and operable on a 320px-wide viewport without requiring the user to zoom or scroll horizontally.
12. WHEN the viewport width is less than 768px, THE Platform SHALL display modal dialogs at full width with a maximum height of 90vh and vertical scrolling enabled.
13. WHEN the viewport width is less than 768px, THE Platform SHALL ensure all interactive elements (buttons, links, form controls) have a minimum tap target size of 44×44 CSS pixels.

---

### Requirement 5: Testing Suite

**User Story:** As a developer, I want a comprehensive unit and end-to-end test suite using Karma and Jasmine, so that I can verify component behavior and catch regressions before deployment.

#### Acceptance Criteria

1. THE Platform SHALL include Jasmine unit test files (`.spec.ts`) for the following services: `AuthService`, `MockApiService`, `ToastService`, `Notification_Service`, `Search_Service`, and `Analytics_Service`.
2. THE Platform SHALL include Jasmine unit test files for the following shared components: `ConfirmDialogComponent`, `GlobalToastComponent`, `SkeletonLoaderComponent`.
3. WHEN the `ng test` command is executed, THE Platform SHALL run all `.spec.ts` files using the Karma test runner configured in `karma.conf.js`.
4. THE AuthService unit tests SHALL verify: successful login sets the `currentUser` Signal to the authenticated user object, failed login with an unknown email returns `{ success: false }`, failed login with a wrong password returns `{ success: false }`, logout clears the `currentUser` Signal to `null` and removes the `joinevents_user` key from sessionStorage, and `hasRole()` returns `true` only when the authenticated user's role matches the argument.
5. THE MockApiService unit tests SHALL verify: `getPackages()` returns an Observable that emits an array, `getPackages(eventTypeId)` returns only packages whose `eventTypeId` matches the argument, `getBookings(customerId)` returns only bookings whose `customerId` matches the argument, and `getVendors()` returns an Observable that emits the current Signal value.
6. THE Search_Service unit tests SHALL verify: filtering by `category` returns only records matching that category, filtering by `minPrice`/`maxPrice` excludes records outside the range, filtering by `minRating` excludes records below the threshold, combining multiple filters applies all conditions simultaneously with AND logic, and calling `clearFilters()` restores the full unfiltered dataset.
7. FOR ALL valid filter parameter combinations applied to a fixed dataset, THE Search_Service SHALL return a result set whose length is less than or equal to the length of the unfiltered dataset (metamorphic property: filtering never adds records).
8. THE Notification_Service unit tests SHALL verify: calling `addNotification()` increments the unread count Signal by one, calling `markAsRead(id)` decrements the unread count Signal by one, calling `markAllAsRead()` sets the unread count Signal to zero, and `getNotifications()` returns notifications sorted by `createdAt` descending.
9. THE Analytics_Service unit tests SHALL verify: `getAdminAnalytics()` emits an object containing all required KPI fields (`totalRevenue`, `monthlyRevenue`, `bookingCountByStatus`, `top5VendorsByEarnings`, `customerAcquisitionByMonth`, `averageBookingValue`), `getVendorAnalytics(vendorId)` emits data where all array fields contain exactly 12 elements, and `getVendorAnalytics('v1')` does not include data from vendor `v2`.
10. THE Platform SHALL include at least one Jasmine component test for the Customer dashboard component verifying that it renders without errors when provided mock data via Angular's `TestBed`.
11. WHEN all unit tests pass, THE Karma test runner SHALL report 0 failures and output a code coverage summary to the terminal.
12. THE Platform SHALL configure Karma coverage reporting to output an HTML coverage report to the `coverage/` directory when `ng test --code-coverage` is executed.

---

### Requirement 6: Performance Optimization

**User Story:** As a Platform user, I want pages to load quickly and the application to remain responsive during navigation, so that I have a smooth experience even on slower connections.

#### Acceptance Criteria

1. THE Platform SHALL configure all feature routes using `loadComponent` to ensure each portal module is loaded only when first navigated to, reducing the initial bundle size.
2. THE Platform SHALL implement an `HttpCacheInterceptor` Angular HTTP interceptor that caches GET responses in memory (per application session) for a configurable TTL between 1 and 3600 seconds inclusive, with a default TTL of 60 seconds.
3. WHEN a cached response exists for a GET request whose full URL string (including query parameters) matches a cached entry and the TTL has not expired, THE HttpCacheInterceptor SHALL return the cached response without making a network request.
4. WHEN the TTL for a cached entry has expired, THE HttpCacheInterceptor SHALL remove the stale entry from the cache and make a new network request for that URL.
5. THE Platform SHALL apply `trackBy` functions to all `@for` loops in component templates that render lists of Bookings, Packages, Vendors, or Notifications to prevent unnecessary DOM re-renders.
6. THE `HttpCacheInterceptor` class and the analytics chart wrapper component SHALL use Angular's `OnPush` change detection strategy.
7. THE Platform SHALL wrap analytics chart components in an Angular `@defer` block configured to trigger when the chart container enters the viewport, so that chart rendering does not block the initial paint of the dashboard page.
8. WHEN the Platform is built with `ng build`, THE build output SHALL produce a main bundle smaller than 500 KB (gzipped) by leveraging the lazy-loaded route structure.
9. THE Platform SHALL add `loading="lazy"` to all `<img>` elements that are not visible in the initial viewport on package and vendor listing pages.
10. THE Platform SHALL implement a custom Angular Router preloading strategy that preloads only the Customer dashboard route (`/customer/dashboard`) and the Vendor dashboard route (`/vendor/dashboard`) after the initial application load completes.

---

### Requirement 7: Accessibility Compliance

**User Story:** As a user with a disability, I want all Platform pages to conform to WCAG 2.1 AA standards, so that I can use the Platform with assistive technologies such as screen readers and keyboard navigation.

#### Acceptance Criteria

1. THE Platform SHALL assign an `aria-label` attribute whose value describes the element's action or purpose to every interactive element (button, link, form input, icon-only control) that does not contain visible text.
2. THE Platform SHALL ensure every `<input>`, `<select>`, and `<textarea>` element has either an associated `<label>` element linked via matching `for` and `id` attributes, or an `aria-label` attribute directly on the control.
3. THE Platform SHALL ensure all text-and-background color combinations meet a minimum contrast ratio of 4.5:1 for normal text (below 18pt or 14pt bold) and 3:1 for large text (18pt or larger, or 14pt bold or larger), as defined by WCAG_2_1_AA Success Criterion 1.4.3.
4. THE Platform SHALL ensure all interactive elements are reachable via Tab and Shift+Tab key navigation and operable via Enter or Space keys, without requiring pointer input, and that the DOM tab order follows the visual reading order of the page.
5. WHEN a modal dialog opens, THE Platform SHALL move keyboard focus to the first focusable element within the dialog, trap Tab and Shift+Tab navigation within the dialog's focusable elements, and prevent focus from reaching elements outside the dialog while it is open.
6. WHEN a modal dialog closes, THE Platform SHALL return keyboard focus to the element that triggered the dialog's opening.
7. THE Platform SHALL provide a visible focus indicator on every focusable element; the focus indicator SHALL meet a minimum contrast ratio of 3:1 between the indicator color and the adjacent background color.
8. THE Platform SHALL include `role`, `aria-expanded`, `aria-haspopup`, `aria-selected`, `aria-controls`, and `aria-current` attributes as applicable on all custom interactive widgets (tabs, dropdowns, off-canvas menus, toast notifications) to communicate their identity, state, and relationships to assistive technologies.
9. THE Platform SHALL ensure every `<img>` element that conveys information has a non-empty `alt` attribute describing the image content, and every decorative `<img>` element has `alt=""` and `role="presentation"`.
10. THE Platform SHALL ensure every `<table>` element includes `<th>` elements with a `scope` attribute set to `"col"` for column headers or `"row"` for row headers.
11. WHEN a Toast notification appears, THE Platform SHALL render it inside a container element with `aria-live="polite"` and `aria-atomic="true"` so that screen readers announce the notification content when it is inserted into the DOM.
12. THE Platform SHALL set a unique, descriptive page title via Angular's `Title` service for each route, following the pattern `[Page Name] | JoinEvents` (e.g., `Dashboard | JoinEvents`).
13. WHEN a form validation error is displayed, THE Platform SHALL associate the error message with its corresponding input using `aria-describedby` and SHALL set `aria-invalid="true"` on the input element.
14. THE Platform SHALL include a visually hidden "Skip to main content" link as the first focusable element on every page, which when activated moves keyboard focus to the main content landmark (`<main>` element).
15. THE Platform SHALL declare the page language by setting `lang="en"` on the root `<html>` element in `index.html`.
