{ pkgs }: {
	deps = [
		pkgs.python39Packages.certbot
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
	];
}