import { EnquiryForm } from '@/components/EnquiryForm';

export function Visit() {
  return (
    <section className="visit" id="visit" aria-labelledby="visit-title">
      <div className="wrap grid">
        <div className="visit__intro">
          <h2 className="visit__title" id="visit-title">
            Visit Your Next <em className="visit__accent">Address</em>
          </h2>
          <p>
            Viewings are by appointment on weekdays and Saturday mornings. Tell us what you are looking for and we
            will call within one working day to arrange a time, or ask for a project’s brochure and we will email it
            to you.
          </p>
        </div>

        <div className="visit__form">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
