import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";
import gsap from "gsap";
import "../../css/Home.css";

const Card = ({ id, image, name, address, price }) => {
  return (
    <figure className="property">
      <Link to={`/propertylist/${id}`}>
        <img src={image} alt="Propertyimg" />
      </Link>
      <h4>{name}</h4>
      <figcaption>
        <main className="propertydetails">
          <h5>{name}</h5>
          <h6>
            <span className="material-symbols-outlined houseicon">
              home_pin
            </span>
            {address}
          </h6>
          <p>
            <span className="price">₹{price}</span> per night
          </p>
        </main>
      </figcaption>
    </figure>
  );
};

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState({ page: 1 });
  const dispatch = useDispatch();

  // 🔥 IMPORTANT: this key must match store
  const { properties, totalProperties, loading } = useSelector(
    (state) => state.properties
  );

  const lastPage = Math.ceil(totalProperties / 12);
  const propertyListRef = useRef(null);

  useEffect(() => {
    dispatch(propertyAction.updateSearchParams(currentPage));
    dispatch(getAllProperties());
  }, [currentPage, dispatch]);

  useEffect(() => {
    if (
      !loading &&
      properties.length > 0 &&
      propertyListRef.current
    ) {
      gsap.fromTo(
        propertyListRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, [properties, loading]);

  // 🔹 LOADING
  if (loading) {
    return <p className="loading_text">Loading properties...</p>;
  }

  // 🔹 NO DATA
  if (!loading && properties.length === 0) {
    return <p className="not_found">Property not found</p>;
  }

  // 🔹 DATA
  return (
    <>
      <div className="propertylist" ref={propertyListRef}>
        {properties.map((property) => (
          <Card
            key={property._id}
            id={property._id}
            image={property.images?.[0]?.url}
            name={property.propertyName}
            address={`${property.address.city}, ${property.address.state} ${property.address.pincode}`}
            price={property.price}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          className="previous_btn"
          onClick={() =>
            setCurrentPage((prev) => ({ page: prev.page - 1 }))
          }
          disabled={currentPage.page === 1}
        >
          <span className="material-symbols-outlined">
            arrow_back_ios_new
          </span>
        </button>

        <button
          className="next_btn"
          onClick={() =>
            setCurrentPage((prev) => ({ page: prev.page + 1 }))
          }
          disabled={
            properties.length < 12 || currentPage.page === lastPage
          }
        >
          <span className="material-symbols-outlined">
            arrow_forward_ios
          </span>
        </button>
      </div>
    </>
  );
};

export default PropertyList;
