{pkgs}: {
  deps = [
    pkgs.redis
    pkgs.openssh
    pkgs.giflib
    pkgs.libjpeg
    pkgs.pango
    pkgs.cairo
    pkgs.libuuid
    pkgs.rsync
    pkgs.zip
    pkgs.iproute2
    pkgs.lsof
    pkgs.procps
    pkgs.jq
    pkgs.ffmpeg
    pkgs.unzip
    pkgs.postgresql
  ];
}
