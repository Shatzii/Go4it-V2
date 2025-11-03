{pkgs}: {
  deps = [
    pkgs.yakut
    # Development tools
    pkgs.gh
    pkgs.nano
    pkgs.htop-vim
    pkgs.jq
    
    # Network tools
    pkgs.unixtools.ping
    pkgs.nmap
    pkgs.iproute2
    pkgs.lsof
    
    # Database
    pkgs.postgresql
    pkgs.redis
    
    # Media processing (optimized for video analysis)
    pkgs.ffmpeg
    pkgs.giflib
    pkgs.libjpeg
    pkgs.pango
    pkgs.cairo
    
    # System utilities
    pkgs.libuuid
    pkgs.rsync
    pkgs.zip
    pkgs.unzip
    pkgs.procps
    pkgs.openssh
    
    # AI/ML - Ollama for local AI models
    pkgs.ollama
  ];
}
