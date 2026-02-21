package game

import "math"

type Question interface {
}

type RadarQuestion struct {
	radarDistance int // in meters
}

func (q RadarQuestion) Answer(asker *Player, answerer *Player) (bool, error) {
	dist := latLongDistance(asker.Position, answerer.Position)
	return dist <= float64(q.radarDistance), nil
}

// Get the distance between two lat/long points in meters.
func latLongDistance(pos1 Position, pos2 Position) float64 {
	// Haversine formula
	const R = 6371000 // Earth radius in meters
	lat1 := pos1.Lat * math.Pi / 180
	lat2 := pos2.Lat * math.Pi / 180
	dLat := (pos2.Lat - pos1.Lat) * math.Pi / 180
	dLong := (pos2.Long - pos1.Long) * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) + math.Cos(lat1)*math.Cos(lat2)*math.Sin(dLong/2)*math.Sin(dLong/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}

type PictureQuestion struct {
	prompt   string
	imageKey string
}

func (q PictureQuestion) Answer(lobby *Lobby, asker *Player, answerer *Player) (bool, error) {
	// TODO
	return false, nil
}
