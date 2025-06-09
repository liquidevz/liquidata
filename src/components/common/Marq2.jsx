import React from 'react';
import { Link } from 'react-router-dom';

function Marq2({ data }) {
  return (
    <section className="serv-marq main-colorbg">
      <div className="container-fluid rest">
        <div className="row">
          <div className="col-12">
            <div className="main-marq xlrg text-u">
              <div className="slide-har st1 non-strok">
                <div className="box">
                  {data.map((item, index) => (
                    <div className="item" key={index}>
                      <Link to="/contact" className="hover-this" aria-label={`Link to ${item}`}>
                        <div className="text-marq">{item}</div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="box">
                  {data.map((item, index) => (
                    <div className="item" key={`second-${index}`}>
                      <Link to="/contact" className="hover-this" aria-label={`Link to ${item}`}>
                        <div className="text-marq">{item}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Marq2;
