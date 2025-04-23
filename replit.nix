{pkgs}: {
  deps = [
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
