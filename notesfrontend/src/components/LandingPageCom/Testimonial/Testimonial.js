import React from "react";
import TestimonialItem from "./TestimonialItem";

const Testimonial = () => {
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 md:px-0 px-5">
      <TestimonialItem
        title="Native Integration API"
        text="The seamless integration capabilities have transformed our development workflow. By reducing manual configuration tasks by 80%, we've accelerated our deployment cycles while maintaining robust security protocols across all environments."
        name="Anubhav Singh"
        status="Lead Developer"
        // imgurl="https://images.pexels.com/photos/792199/pexels-photo-792199.jpeg?cs=srgb&dl=pexels-natri-792199.jpg&fm=jpg"
      />
      <TestimonialItem
        title="Performance Optimization"
        text="This solution dramatically improved our application's load times. Response latency decreased from 2.3 seconds to under 400 milliseconds, directly contributing to a 40% increase in user retention and positive engagement metrics."
        name="Alice"
        status="Product Manager"
      />
      <TestimonialItem
        title="Scalability Framework"
        text="Our infrastructure now handles peak traffic effortlessly. During our last major campaign, the system seamlessly scaled to accommodate 500% more concurrent users without any service degradation or downtime."
        name="Bob"
        status="CTO"
      />
    </div>
  );
};

export default Testimonial;