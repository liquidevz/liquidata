import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import WOW from 'wowjs';

// Default data to use as fallback
const defaultTeamData = [
  {
    _id: '1',
    name: 'John Doe',
    position: 'CEO',
    imageUrl: '/assets/imgs/team/1.jpg',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    position: 'Designer',
    imageUrl: '/assets/imgs/team/2.jpg',
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    position: 'Developer',
    imageUrl: '/assets/imgs/team/3.jpg',
  },
];

function Team() {
  const [teamMembers, setTeamMembers] = useState(defaultTeamData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await api.getTeam();
        // Ensure we always have an array with at least the default data
        const data = Array.isArray(response.data) && response.data.length > 0 
          ? response.data.map(member => ({
              ...member,
              // Ensure imageUrl exists and has the correct format
              imageUrl: member.imageUrl || member.image || '/assets/imgs/team/placeholder.jpg'
            }))
          : defaultTeamData;
        setTeamMembers(data);
        setError(null);
        // Initialize WOW.js
        if (typeof window !== 'undefined') {
          new WOW.WOW().init();
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        setError('Failed to load team members');
        setTeamMembers(defaultTeamData);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <section className="team section-padding pt-0">
        <div className="container">
          <div className="text-center">Loading team members...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="team section-padding pt-0">
      <div className="container">
        {error && (
          <div className="alert alert-warning text-center mb-4">
            {error}
          </div>
        )}
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Our Team</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Meet our <span className="fw-200">legends.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a href="/page-team" className="butn butn-sm butn-bord radius-30">
                <span>Join to us</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="row">
          {teamMembers.map((member) => (
            <div key={member._id} className="col-lg-4">
              <div className="item md-mb50">
                <div className="img">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/imgs/team/placeholder.jpg';
                    }}
                  />
                  <div className="info">
                    <span className="fz-12">{member.position}</span>
                    <h6 className="fz-18">{member.name}</h6>
                  </div>
                </div>
                <div className="social">
                  <div className="links">
                    {member.socialLinks?.facebook && (
                      <a href={member.socialLinks.facebook}>
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a href={member.socialLinks.twitter}>
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a href={member.socialLinks.instagram}>
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
