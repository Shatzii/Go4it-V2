{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.python3
    pkgs.sqlite
    pkgs.ffmpeg
    pkgs.curl
    pkgs.wget
  ];
}
