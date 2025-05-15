import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useSimplifiedAuth } from "@/contexts/simplified-auth-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SimpleHome() {
  const { user, logout, loading } = useSimplifiedAuth();
  const [, navigate] = useLocation();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0e1628" }}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    } else if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div style={{ 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: "#0e1628",
      color: "white",
      margin: 0,
      padding: 0,
      minHeight: "100vh"
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        borderBottom: "1px solid #2563eb"
      }}>
        <div style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#38bdf8"
        }}>Go4It Sports</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span id="user-name">{user.name}</span>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold"
          }}>{getInitials()}</div>
        </div>
      </header>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
      }}>
        <div style={{
          display: "flex",
          padding: "20px 0"
        }} className="main-content">
          <div style={{
            width: "250px",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            padding: "20px",
            borderRadius: "10px",
            marginRight: "20px",
            height: "calc(100vh - 140px)"
          }} className="sidebar">
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: "12px 15px",
                borderRadius: "6px",
                marginBottom: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#2563eb"
              }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>📊</div>
                Dashboard
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>📹</div>
                Videos
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>⭐</div>
                Highlights
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>📈</div>
                Performance
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>🏫</div>
                Schools
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>👥</div>
                Coaches
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>📝</div>
                Training
              </li>
              <li style={{ padding: "12px 15px", borderRadius: "6px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</div>
                Settings
              </li>
            </ul>
            
            <div style={{ marginTop: "30px" }}>
              <Button 
                className="button" 
                onClick={() => logout()}
                style={{
                  width: "100%",
                  background: "linear-gradient(to right, #2563eb, #0891b2)",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Logout
              </Button>
            </div>
          </div>
          
          <div style={{ flex: 1 }} className="content">
            <div style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h2 style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#38bdf8"
              }}>Performance Overview</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                marginBottom: "20px"
              }}>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "10px 0",
                    color: "#38bdf8"
                  }}>87.5</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8"
                  }}>GAR Score</div>
                </div>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "10px 0",
                    color: "#38bdf8"
                  }}>12</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8"
                  }}>Videos Uploaded</div>
                </div>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "10px 0",
                    color: "#38bdf8"
                  }}>8</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8"
                  }}>Coach Views</div>
                </div>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "10px 0",
                    color: "#38bdf8"
                  }}>4</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8"
                  }}>School Interests</div>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h2 style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#38bdf8"
              }}>Recent Videos</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px"
              }}>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: "100%",
                    height: "160px",
                    backgroundColor: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>Video 1</div>
                  <div style={{ padding: "15px" }}>
                    <div style={{ fontSize: "16px", marginBottom: "8px" }}>Game Highlights vs. Westside High</div>
                    <div style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>May 10, 2025</span>
                      <span>3:42</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: "100%",
                    height: "160px",
                    backgroundColor: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>Video 2</div>
                  <div style={{ padding: "15px" }}>
                    <div style={{ fontSize: "16px", marginBottom: "8px" }}>Skills Drill - Agility Training</div>
                    <div style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>May 8, 2025</span>
                      <span>2:15</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: "100%",
                    height: "160px",
                    backgroundColor: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>Video 3</div>
                  <div style={{ padding: "15px" }}>
                    <div style={{ fontSize: "16px", marginBottom: "8px" }}>Field Work - Running Routes</div>
                    <div style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>May 5, 2025</span>
                      <span>4:30</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <Button 
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(to right, #2563eb, #0891b2)",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  View All Videos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}