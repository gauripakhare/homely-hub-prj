import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import gsap from "gsap";
import "../../css/Home.css";

const PropertyList = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { properties, totalProperties, loading } = useSelector(
    (state) => state.properties
  );

  const propertyListRef = useRef(null);
  const lastPage = Math.ceil(totalProperties / 12);

  // 🔹 ONLY update params here
  useEffect(() => {
    dispatch(propertyAction.updateSearchParams({ page }));
  }, [page, dispatch]);

  // 🔹 ONLY fetch here
  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && properties.length && propertyListRef.current) {
      gsap.fromTo(
        propertyListRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08 }
      );
    }
  }, [loading, properties]);

  if (loading) return <p>Loading properties...</p>;
  if (!properties.length) return <p>Property not found</p>;

  return (
    <>
      <div className="propertylist" ref={propertyListRef}>
        {properties.map((p) => (
          <figure key={p._id} className="property">
            <Link to={`/propertylist/${p._id}`}>
              <img src={p.images?.[0]?.url} alt="" />
            </Link>
            <h4>{p.propertyName}</h4>
            <p>₹{p.price}</p>
          </figure>
        ))}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <button
          disabled={page === lastPage}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default PropertyList;
